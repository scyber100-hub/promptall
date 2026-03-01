# Design: user-profile

## Status
- Plan: ✅ `docs/01-plan/features/user-profile.plan.md`
- Design: 🔄 In Progress

---

## Architecture

```
[Profile Page - Server Component] MOD
  ├─ generateMetadata() → FR-05 SEO
  ├─ getProfileData()
  │   ├─ slug: p.slug ?? p._id.toString()  ← FR-04 Fix
  │   └─ 초기 12개 + total count 조회
  ├─ likeCount 표시 → FR-02
  └─ <ProfilePrompts> 전달 (initialPrompts, total, username, locale) → FR-03

[ProfilePrompts - Client Component] NEW
  components/profile/ProfilePrompts.tsx
  ├─ useState: prompts, page, loading, hasMore
  ├─ "더 보기" 클릭 → GET /api/users/[username]/prompts?page=N&limit=12
  └─ 추가 로드된 프롬프트 append

[Prompts API] NEW
  app/api/users/[username]/prompts/route.ts
  └─ GET ?page=1&limit=12 → { prompts, total, hasMore }

[Settings Profile Page - Client Component] MOD
  app/[locale]/settings/profile/page.tsx
  ├─ 기존 image URL 입력 필드 제거
  └─ 파일 업로드 버튼 → POST /api/upload → image state 업데이트 → FR-01
```

---

## FR-01: 아바타 이미지 파일 업로드

### `app/[locale]/settings/profile/page.tsx` (MOD)

**변경 사항:**
- `image` state: URL string 유지 (서버 저장 형태 동일)
- `uploading` state 추가: `const [uploading, setUploading] = useState(false);`
- 기존 `<input type="url" ... />` (image URL 입력) 제거
- 대체: 파일 업로드 영역 추가

```typescript
// 추가할 state
const [uploading, setUploading] = useState(false);

// 추가할 핸들러
const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();
  if (data.url) setImage(data.url);
  setUploading(false);
};
```

**기존 image URL 입력 섹션 → 교체 JSX:**
```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {t('image_label')}
  </label>
  <div className="flex items-center gap-4">
    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
      <Upload size={16} />
      {uploading ? 'Uploading...' : 'Upload Photo'}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
        disabled={uploading}
      />
    </label>
    {image && (
      <button
        type="button"
        onClick={() => setImage('')}
        className="text-xs text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    )}
  </div>
  <p className="text-xs text-gray-400 mt-1">{t('image_hint')}</p>
</div>
```

**Import 추가**: `Upload` from `lucide-react`

---

## FR-02: Profile stats likeCount 표시

### `app/[locale]/profile/[username]/page.tsx` (MOD)

**변경 위치**: 헤더 stats row (`div.flex.items-center.gap-4.mt-3`)

```tsx
// 기존 import에 Heart 추가
import { CalendarDays, FileText, Heart } from 'lucide-react';

// stats row에 추가 (promptCount 다음)
<span className="flex items-center gap-1">
  <Heart size={14} />
  {u.likeCount ?? 0} likes
</span>
```

---

## FR-03: 프롬프트 더 보기

### `app/api/users/[username]/prompts/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Prompt from '@/models/Prompt';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = 12;
  const skip = (page - 1) * limit;

  try {
    await connectDB();
    const user = await User.findOne({ username }).select('_id').lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const [raws, total] = await Promise.all([
      Prompt.find({ author: (user as any)._id, status: 'active' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title description aiTool category resultImages authorName authorUsername likeCount commentCount viewCount createdAt slug')
        .lean(),
      Prompt.countDocuments({ author: (user as any)._id, status: 'active' }),
    ]);

    const prompts = raws.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      resultImages: p.resultImages ?? [],
      createdAt: p.createdAt?.toISOString() ?? '',
      slug: p.slug ?? p._id.toString(),
    }));

    return NextResponse.json({ prompts, total, hasMore: skip + limit < total });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### `components/profile/ProfilePrompts.tsx` (NEW)

```typescript
'use client';
import { useState } from 'react';
import { PromptCard } from '@/components/prompts/PromptCard';

interface ProfilePromptsProps {
  initialPrompts: any[];
  total: number;
  username: string;
  locale: string;
}

export function ProfilePrompts({ initialPrompts, total, username, locale }: ProfilePromptsProps) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = prompts.length < total;

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const res = await fetch(`/api/users/${username}/prompts?page=${nextPage}&limit=12`);
    const data = await res.json();
    setPrompts((prev) => [...prev, ...data.prompts]);
    setPage(nextPage);
    setLoading(false);
  };

  return (
    <>
      {prompts.length === 0 ? (
        <p className="text-gray-400 text-sm">No prompts submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt: any) => (
            <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}
```

### `app/[locale]/profile/[username]/page.tsx` 변경 (MOD - FR-03)

**getProfileData 변경**: total count 추가 조회
```typescript
async function getProfileData(username: string) {
  await connectDB();
  const user = await User.findOne({ username }).select('-password -email').lean();
  if (!user) return null;

  const [rawPrompts, promptTotal] = await Promise.all([
    Prompt.find({ author: (user as any)._id, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean(),
    Prompt.countDocuments({ author: (user as any)._id, status: 'active' }),
  ]);
  // ...직렬화...
  return { user: serializedUser, prompts, promptTotal };
}
```

**JSX 변경**: 기존 prompts 섹션 → `<ProfilePrompts>` 사용
```tsx
import { ProfilePrompts } from '@/components/profile/ProfilePrompts';

// 기존 prompts 렌더링 섹션 교체
<ProfilePrompts
  initialPrompts={prompts}
  total={promptTotal}
  username={u.username}
  locale={locale}
/>
```

---

## FR-04: slug 직렬화 Fix

### `app/[locale]/profile/[username]/page.tsx` (MOD)

`getProfileData()` 내 prompts map에 slug 추가:
```typescript
const prompts = rawPrompts.map((p: any) => ({
  ...p,
  _id: p._id.toString(),
  author: p.author?.toString() ?? null,
  resultImages: p.resultImages ?? [],
  viewCount: p.viewCount ?? 0,
  createdAt: p.createdAt?.toISOString() ?? '',
  updatedAt: p.updatedAt?.toISOString() ?? '',
  slug: p.slug ?? p._id.toString(),  // ← 추가
}));
```

---

## FR-05: generateMetadata

### `app/[locale]/profile/[username]/page.tsx` (MOD)

```typescript
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  await connectDB();
  const user = await User.findOne({ username }).select('name username bio image').lean();
  if (!user) return { title: 'Not Found' };
  const u = user as any;
  return {
    title: `${u.name} (@${u.username}) | PromptAll`,
    description: u.bio || `${u.name}'s prompts on PromptAll`,
    openGraph: {
      title: `${u.name} (@${u.username})`,
      description: u.bio || `${u.name}'s prompts on PromptAll`,
      images: u.image ? [{ url: u.image }] : [{ url: '/opengraph-image' }],
    },
  };
}
```

**Import 추가**: `import type { Metadata } from 'next';`

**Note**: `getProfileData`와 DB 호출 중복 → `generateMetadata`에서는 별도 `.lean()` 호출 (cache 불가 — `export const dynamic = 'force-dynamic'` 사용 중이므로 React.cache() 사용 가능하나 User 조회는 경량이라 별도 호출도 무방)

---

## File Manifest

| 파일 | 액션 | 변경 내용 |
|------|------|-----------|
| `app/[locale]/settings/profile/page.tsx` | MOD | 파일 업로드 버튼, Upload 아이콘, uploading state |
| `app/[locale]/profile/[username]/page.tsx` | MOD | generateMetadata, likeCount, slug fix, ProfilePrompts 사용, promptTotal |
| `components/profile/ProfilePrompts.tsx` | NEW | 더 보기 Client Component |
| `app/api/users/[username]/prompts/route.ts` | NEW | 페이지네이션 API |

**총 4개 파일** (NEW 2 + MOD 2)

---

## Implementation Order

1. `app/api/users/[username]/prompts/route.ts` — API 먼저 (독립적)
2. `components/profile/ProfilePrompts.tsx` — API 완성 후 컴포넌트
3. `app/[locale]/profile/[username]/page.tsx` — FR-02~05 한 파일에 모두 적용
4. `app/[locale]/settings/profile/page.tsx` — 아바타 업로드 (독립적)

---

## Error Handling

| 상황 | 처리 |
|------|------|
| 아바타 업로드 실패 | `data.url` 없으면 image state 미변경 (기존 유지) |
| 더 보기 API 실패 | loading 해제, 기존 prompts 유지 (alert 없음) |
| 비공개 유저 | 기존 notFound() 동일 |
| generateMetadata user 없음 | `{ title: 'Not Found' }` |

---

## Type Notes

- `promptTotal` — `getProfileData` 반환 타입에 추가
- `ProfilePrompts` props의 `initialPrompts: any[]` — PromptCard 기존 타입과 동일
- API route params: `Promise<{ username: string }>` (Next.js 16 패턴)
