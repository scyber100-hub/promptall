# Design: admin-dashboard

## Status
- Plan: ✅ `docs/01-plan/features/admin-dashboard.plan.md`
- Design: 🔄 In Progress

## Current State Analysis
- `app/[locale]/admin/page.tsx` — role 체크 + Prompt/User 50개 fetch → AdminConsole 전달
- `components/admin/AdminConsole.tsx` — Prompts/Users/Notifications 탭, CRUD 액션
- `app/api/admin/prompts/[id]` — PATCH(status) / DELETE
- `app/api/admin/users/[id]` — PATCH(status/role)
- `app/api/admin/notifications` — GET/PATCH
- `User.role: 'user' | 'admin'`, `Prompt.reportCount: number` — 필드 존재

---

## Architecture

```
[Admin Page - Server Component]
  ├─ DB 직접 쿼리 → stats (4개 카운트)
  ├─ Prompt.find(50개) → initialPrompts
  ├─ User.find(50개) → initialUsers
  └─ <AdminConsole stats={stats} initialPrompts={...} initialUsers={...} />

[AdminConsole - Client Component]
  ├─ Stats Cards (4개)
  ├─ Tabs: Prompts | Users | Notifications
  ├─ Prompts Tab
  │   ├─ Filter: All / Reported(N) / Hidden / Deleted
  │   ├─ Search: 제목 or authorUsername
  │   └─ Table (기존 + 필터/정렬 적용)
  └─ Users Tab
      ├─ Search: name, username, email
      └─ Table (기존)

[Header - Client Component]
  └─ User Dropdown
      └─ session.role === 'admin' → Admin Console 링크 (조건부)

[GET /api/admin/stats] - New API
  └─ totalUsers, totalPrompts, newUsersToday, reportedPrompts
```

---

## FR-01: 통계 개요 패널

### `app/api/admin/stats/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import User from '@/models/User';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await connectDB();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalUsers, totalPrompts, newUsersToday, reportedPrompts] = await Promise.all([
      User.countDocuments({}),
      Prompt.countDocuments({ status: 'active' }),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      Prompt.countDocuments({ reportCount: { $gt: 0 }, status: 'active' }),
    ]);

    return NextResponse.json({ totalUsers, totalPrompts, newUsersToday, reportedPrompts });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### `app/[locale]/admin/page.tsx` 수정 (MOD)

```typescript
// stats 직접 DB 쿼리 (Server Component이므로 self-fetch 불필요)
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const [rawPrompts, rawUsers, stats] = await Promise.all([
  Prompt.find({}).sort({ createdAt: -1 }).limit(50)
    .select('title status reportCount authorUsername createdAt likeCount viewCount slug').lean(),
  User.find({}).sort({ createdAt: -1 }).limit(50)
    .select('name username email role status promptCount createdAt').lean(),
  Promise.all([
    User.countDocuments({}),
    Prompt.countDocuments({ status: 'active' }),
    User.countDocuments({ createdAt: { $gte: todayStart } }),
    Prompt.countDocuments({ reportCount: { $gt: 0 }, status: 'active' }),
  ]).then(([totalUsers, totalPrompts, newUsersToday, reportedPrompts]) => ({
    totalUsers, totalPrompts, newUsersToday, reportedPrompts,
  })),
]);

return <AdminConsole initialPrompts={prompts} initialUsers={users} stats={stats} />;
```

### 통계 카드 UI (AdminConsole 상단)

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 👥 Total     │ │ 📝 Active    │ │ ✨ New Today │ │ 🚨 Reported  │
│ Users        │ │ Prompts      │ │              │ │              │
│   1,234      │ │    567       │ │     12       │ │      3       │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

```typescript
interface AdminStats {
  totalUsers: number;
  totalPrompts: number;
  newUsersToday: number;
  reportedPrompts: number;
}

// AdminConsoleProps에 stats 추가
interface AdminConsoleProps {
  initialPrompts: AdminPrompt[];
  initialUsers: AdminUser[];
  stats: AdminStats;
}

// 통계 카드 컴포넌트 (AdminConsole 내부 inline)
const STAT_CARDS = [
  { label: 'Total Users', key: 'totalUsers', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Prompts', key: 'totalPrompts', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'New Today', key: 'newUsersToday', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Reported', key: 'reportedPrompts', color: 'text-red-600', bg: 'bg-red-50' },
] as const;
```

---

## FR-02: 신고된 프롬프트 필터

### 필터 상태 및 로직

```typescript
// AdminConsole에 추가
const [promptFilter, setPromptFilter] = useState<'all' | 'reported' | 'hidden' | 'deleted'>('all');

const filteredByStatus = useMemo(() => {
  const sorted = promptFilter === 'reported'
    ? [...prompts].sort((a, b) => b.reportCount - a.reportCount)
    : prompts;

  return sorted.filter((p) => {
    if (promptFilter === 'reported') return p.reportCount > 0 && p.status === 'active';
    if (promptFilter === 'hidden') return p.status === 'hidden';
    if (promptFilter === 'deleted') return p.status === 'deleted';
    return true; // 'all'
  });
}, [prompts, promptFilter]);
```

### 필터 버튼 UI

```tsx
// Prompts 탭 상단 (테이블 위)
<div className="flex gap-2 mb-4">
  {([
    { key: 'all', label: 'All' },
    { key: 'reported', label: `Reported (${stats.reportedPrompts})`, danger: true },
    { key: 'hidden', label: 'Hidden' },
    { key: 'deleted', label: 'Deleted' },
  ] as const).map(({ key, label, danger }) => (
    <button
      key={key}
      onClick={() => setPromptFilter(key)}
      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
        promptFilter === key
          ? danger ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  ))}
</div>
```

---

## FR-03: 테이블 검색

### 검색 상태 및 최종 필터링

```typescript
const [promptSearch, setPromptSearch] = useState('');
const [userSearch, setUserSearch] = useState('');

// Prompts: 상태 필터 → 검색 필터 순으로 적용
const displayedPrompts = useMemo(() =>
  filteredByStatus.filter((p) => {
    if (!promptSearch) return true;
    const q = promptSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.authorUsername.toLowerCase().includes(q);
  }), [filteredByStatus, promptSearch]);

// Users
const displayedUsers = useMemo(() =>
  users.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }), [users, userSearch]);
```

### 검색 입력 UI

```tsx
// Prompts 탭 필터 버튼 우측
<div className="relative ml-auto">
  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    value={promptSearch}
    onChange={(e) => setPromptSearch(e.target.value)}
    placeholder="Search title or author..."
    className="pl-7 pr-7 py-1 text-xs border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-indigo-500"
  />
  {promptSearch && (
    <button onClick={() => setPromptSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
      <X size={12} />
    </button>
  )}
</div>
```

---

## FR-04: Header 어드민 링크

### `components/layout/Header.tsx` 수정 (MOD)

```tsx
// lucide 추가: Shield
import { Menu, X, Globe, ChevronDown, BookmarkIcon, PenSquare, LogOut, User, Search, Shield } from 'lucide-react';

// 유저 드롭다운 내 — 기존 "마이페이지" 위에 추가
{(session.user as any)?.role === 'admin' && (
  <Link
    href={`/${locale}/admin`}
    onClick={() => setUserOpen(false)}
    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors border-b border-slate-100"
  >
    <Shield size={14} className="text-indigo-500" />
    Admin Console
  </Link>
)}
```

---

## File Manifest

| 파일 | 액션 | 변경 내용 |
|------|------|-----------|
| `app/api/admin/stats/route.ts` | NEW | 통계 GET API (4개 카운트) |
| `app/[locale]/admin/page.tsx` | MOD | stats 쿼리 추가, AdminConsole에 stats prop 전달 |
| `components/admin/AdminConsole.tsx` | MOD | stats 카드 + 필터 탭 + 검색 입력 + useMemo |
| `components/layout/Header.tsx` | MOD | Shield 아이콘 + 어드민 조건부 링크 |

**총 4개 파일** (NEW 1 + MOD 3)

---

## Implementation Order

1. `app/api/admin/stats/route.ts` — stats API 생성
2. `app/[locale]/admin/page.tsx` — stats 쿼리 + prop 전달
3. `components/admin/AdminConsole.tsx` — 모든 UI 변경 (stats 카드, 필터, 검색)
4. `components/layout/Header.tsx` — 어드민 링크 추가

---

## Type Changes

```typescript
// AdminConsole.tsx에 추가
interface AdminStats {
  totalUsers: number;
  totalPrompts: number;
  newUsersToday: number;
  reportedPrompts: number;
}

// AdminConsoleProps 수정
interface AdminConsoleProps {
  initialPrompts: AdminPrompt[];
  initialUsers: AdminUser[];
  stats: AdminStats; // 추가
}
```

---

## Error Handling

| 상황 | 처리 |
|------|------|
| stats API 403 | 어드민 아닌 경우 Forbidden |
| stats DB 오류 | try/catch → 500 |
| 검색 결과 없음 | "No results" 텍스트 표시 (기존 empty 메시지 재활용) |
| reportedPrompts=0 | "Reported (0)" 버튼 표시, 클릭 시 빈 테이블 |
