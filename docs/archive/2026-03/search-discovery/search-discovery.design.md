# Design: search-discovery

## Status
- Plan: ✅ `docs/01-plan/features/search-discovery.plan.md`
- Design: 🔄 In Progress

## Current State Analysis
- `GET /api/prompts?q=` — MongoDB `$text` 검색 이미 작동
- `PromptSchema.index({ title: 'text', content: 'text', tags: 'text' })` — text index 존재
- `PromptFilters` — 검색 입력 있으나 "유형"/"카테고리"/"AI 도구" 한국어 하드코딩
- `Header` — 검색 바 UI 없음 (locale key만 존재)

---

## Architecture

```
[Header - Client Component]
  └─ SearchBar (inline 또는 expandable)
       └─ router.push(`/[locale]/search?q=`)

[Search Page - Server Component] /[locale]/search?q=&tab=
  ├─ Prompts Tab: Prompt.find({ $text: { $search: q } })
  └─ Users Tab:   GET /api/search/users?q=

[GET /api/search/users] - New API Route
  └─ User.find({ $or: [name regex, username regex] })
```

---

## FR-01: Header 검색 바

**파일**: `components/layout/Header.tsx` (수정)

### Desktop 레이아웃
```
[Logo] [Nav: Home Browse Explore] [SearchBar] [Lang] [Submit] [Bell] [User]
```
- 검색창 위치: Nav 우측, 언어 스위처 좌측
- 너비: `w-56` (고정), focus 시 `w-72`로 확장 (CSS transition)
- 아이콘: `Search` (lucide) left-inside

### Mobile 레이아웃
- 기본: 검색 아이콘 버튼만 표시 (`Search` icon)
- 클릭 시: `searchOpen` state → Header 하단에 full-width 입력창 슬라이드인
- 완료/닫기: X 버튼 또는 Enter 제출

### 동작
```typescript
// state 추가
const [searchOpen, setSearchOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

// 검색 제출
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;
  router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
  setSearchOpen(false);
};

// /search 페이지일 때 q pre-fill
useEffect(() => {
  const url = new URL(window.location.href);
  const q = url.searchParams.get('q');
  if (q) setSearchQuery(q);
}, [pathname]);
```

---

## FR-02: 검색 결과 페이지

**파일**: `app/[locale]/search/page.tsx` (NEW)

```typescript
// Server Component (searchParams 기반 → 자동 dynamic)
interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; tab?: string }>;
}
```

### UI 구조
```
/search?q=chatgpt&tab=prompts
┌──────────────────────────────────────────┐
│ Search Results for "chatgpt"             │
│                                          │
│ [Prompts (42)] [Users (5)]               │ ← 탭
├──────────────────────────────────────────┤
│ [PromptCard] [PromptCard] [PromptCard]   │ (Prompts 탭)
│ [PromptCard] [PromptCard] [PromptCard]   │
│ ...                                       │
└──────────────────────────────────────────┘
```

### 탭 전환
- `tab=prompts` (기본) / `tab=users`
- 서버에서 탭별 데이터 fetch → Link로 탭 전환 (full 서버 재렌더)

### Prompts 탭 쿼리
```typescript
// 기존 Prompt.find 로직 재사용
const query = { status: 'active', $text: { $search: q } };
// textScore 정렬 (관련성)
const prompts = await Prompt.find(query, { score: { $meta: 'textScore' } })
  .sort({ score: { $meta: 'textScore' } })
  .limit(20).lean();
```

### Users 탭 쿼리
```typescript
// GET /api/search/users 대신 서버에서 직접 DB 조회 (Server Component 이점)
const regex = new RegExp(q, 'i');
const users = await User.find({
  $or: [{ name: regex }, { username: regex }],
  status: 'active'
}).select('_id name username image bio followerCount promptCount')
  .limit(20).lean();
```

### q 없을 때
```tsx
<p className="text-gray-400">{t('no_query')}</p>
```

---

## FR-03: 유저 검색 API

**파일**: `app/api/search/users/route.ts` (NEW)

```typescript
// GET /api/search/users?q=&page=1&limit=20
// 인증 불필요 (공개 검색)
export async function GET(req: NextRequest) {
  const q = searchParams.get('q')?.trim();
  if (!q || q.length < 1) return NextResponse.json({ users: [], total: 0 });

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // escape regex
  const query = {
    $or: [{ name: regex }, { username: regex }],
    status: 'active'
  };

  const [users, total] = await Promise.all([
    User.find(query)
      .select('_id name username image bio followerCount promptCount')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(query)
  ]);

  // 직렬화
  return NextResponse.json({ users: serialized, total, page, pages });
}
```

---

## FR-04: PromptFilters i18n 수정

**파일**: `components/prompts/PromptFilters.tsx` (수정)

**변경 전 → 후**:
```tsx
// Before (하드코딩)
<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">유형</p>
<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">카테고리</p>
<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI 도구</p>
// 전체 버튼: "전체"

// After (i18n)
<p ...>{t('prompts.filter_type')}</p>
<p ...>{t('prompts.filter_category')}</p>
<p ...>{t('prompts.filter_ai_tool')}</p>
// 전체 버튼: {t('prompts.filter_all')}
```

---

## Locale Keys 추가

### `search` 네임스페이스 (NEW)
```json
"search": {
  "title": "Search Results",
  "no_query": "Enter a keyword to search.",
  "prompts_tab": "Prompts",
  "users_tab": "Users",
  "no_results_prompts": "No prompts found for \"{query}\".",
  "no_results_users": "No users found for \"{query}\".",
  "results_prompts": "{count} prompts found",
  "results_users": "{count} users found"
}
```

### `prompts` 네임스페이스 추가 키
```json
"filter_type": "Type",
"filter_category": "Category",
"filter_ai_tool": "AI Tool",
"filter_all": "All"
```

---

## File Manifest

| File | Action | Description |
|------|--------|-------------|
| `components/layout/Header.tsx` | MOD | 검색 바 추가 (desktop inline + mobile expandable) |
| `app/[locale]/search/page.tsx` | NEW | 검색 결과 Server Component (Prompts/Users 탭) |
| `app/api/search/users/route.ts` | NEW | 유저 검색 REST API |
| `components/prompts/PromptFilters.tsx` | MOD | 한국어 하드코딩 → i18n |
| `messages/en.json` | MOD | search 네임스페이스 + prompts filter 키 |
| `messages/ko.json` | MOD | 동일 |
| `messages/ja.json` | MOD | 동일 |
| `messages/zh.json` | MOD | 동일 |
| `messages/es.json` | MOD | 동일 |
| `messages/fr.json` | MOD | 동일 |

**총 10개 파일** (2 new, 8 modified)

---

## Implementation Order

1. `messages/*.json` x6 — search 네임스페이스 + filter 키 추가
2. `components/prompts/PromptFilters.tsx` — i18n 적용
3. `app/api/search/users/route.ts` — 유저 검색 API
4. `app/[locale]/search/page.tsx` — 검색 결과 페이지
5. `components/layout/Header.tsx` — 검색 바 추가

---

## Error Handling

| 상황 | 처리 |
|------|------|
| q 빈 값 | 검색 제출 차단 (클라이언트), API 빈 배열 반환 |
| MongoDB text 검색 오류 | try/catch → 빈 결과 반환 |
| 특수문자 regex | `replace(/[.*+?^${}()...]/g, '\\$&')` escape |
| 결과 없음 | 빈 상태 UI (no_results 메시지) |
