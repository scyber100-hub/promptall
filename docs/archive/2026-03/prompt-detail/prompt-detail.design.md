# Design: prompt-detail

## Status
- Plan: ✅ `docs/01-plan/features/prompt-detail.plan.md`
- Design: 🔄 In Progress

---

## Architecture

```
[Prompt Detail Page - Server Component]
  ├─ getPrompt(id) — 기존 (slug/id 조회)
  ├─ getAuthor(authorUsername) — NEW (User.findOne → _id, bio, image, followerCount)
  ├─ getRelatedPrompts(category, currentId) — NEW (limit 4, likeCount 내림차순)
  └─ 렌더링
      ├─ 기존 메인 콘텐츠 (변경 없음)
      ├─ 액션 버튼 row (ShareButtons + EditButton 추가)
      ├─ 사이드바 (AuthorCard 추가 — 최상단)
      └─ 관련 프롬프트 섹션 (CommentSection 위)

[ShareButtons - Client Component] NEW
  └─ 링크 복사 + X 공유

[AuthorCard - Client Component] NEW (FollowButton 포함)
  └─ 작성자 아바타, 이름, bio, followerCount, FollowButton

[RelatedPrompts - Server Component] NEW
  └─ PromptCard 4개 grid (기존 PromptCard 재사용)
```

---

## FR-01: 관련 프롬프트 섹션

### DB 쿼리 (`page.tsx` 내)

```typescript
// page.tsx에 추가 (getPrompt 이후)
const getRelatedPrompts = cache(async (category: string, currentId: string) => {
  await connectDB();
  const raws = await Prompt.find({
    category,
    status: 'active',
    _id: { $ne: currentId },
  })
    .sort({ likeCount: -1 })
    .limit(4)
    .select('title description aiTool category resultImages authorName authorUsername likeCount commentCount viewCount createdAt slug')
    .lean();

  return raws.map((r: any) => ({
    ...r,
    _id: r._id.toString(),
    createdAt: r.createdAt?.toISOString() ?? '',
    resultImages: r.resultImages ?? [],
  }));
});
```

### `components/prompts/RelatedPrompts.tsx` (NEW)

```typescript
import Link from 'next/link';
import { PromptCard } from '@/components/prompts/PromptCard';

interface RelatedPromptsProps {
  prompts: RelatedPrompt[];
  locale: string;
}

// RelatedPrompt 타입 = PromptCard의 prompt prop 타입과 동일
export function RelatedPrompts({ prompts, locale }: RelatedPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-100 pt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Prompts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {prompts.map((p) => (
          <PromptCard key={p._id} prompt={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
```

### 레이아웃 위치 (page.tsx)

```tsx
{/* Comments */}
<CommentSection promptId={p._id.toString()} locale={locale} />

{/* Related Prompts — CommentSection 아래 */}
<RelatedPrompts prompts={relatedPrompts} locale={locale} />
```

---

## FR-02: 소셜 공유 버튼

### `components/prompts/ShareButtons.tsx` (NEW)

```typescript
'use client';
import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleXShare = () => {
    const text = encodeURIComponent(document.title);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
          copied
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
        title="Copy link"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      {/* X Share */}
      <button
        onClick={handleXShare}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        title="Share on X"
      >
        <XIcon />
        Share
      </button>
    </div>
  );
}

// X(Twitter) SVG 아이콘 (lucide에 없음)
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}
```

### 액션 버튼 row 위치 (page.tsx)

```tsx
{/* Action buttons */}
<div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 mt-6 flex-wrap">
  <LikeButton promptId={p._id.toString()} initialCount={p.likeCount} locale={locale} />
  <BookmarkButton promptId={p._id.toString()} locale={locale} />
  <AddToCollectionButton promptId={p._id.toString()} />
  <ShareButtons />                          {/* NEW */}
  {session?.user && (session.user as any).id === p.author && (  {/* NEW */}
    <Link
      href={`/${locale}/prompts/${p._id}/edit`}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
    >
      <Pencil size={14} />
      Edit
    </Link>
  )}
  <div className="ml-auto">
    <ReportButton promptId={p._id.toString()} />
  </div>
</div>
```

**Note**: FR-04 편집 버튼을 page.tsx (Server Component)에서 `session`으로 분기하려면 `getServerSession` 사용.

---

## FR-03: 작성자 카드 (사이드바)

### DB 쿼리 (`page.tsx` 내)

```typescript
const getAuthor = cache(async (username: string) => {
  await connectDB();
  const raw = await User.findOne({ username })
    .select('_id name username image bio followerCount')
    .lean();
  if (!raw) return null;
  const u = raw as any;
  return {
    _id: u._id.toString(),
    name: u.name,
    username: u.username,
    image: u.image ?? null,
    bio: u.bio ?? null,
    followerCount: u.followerCount ?? 0,
  };
});
```

### `components/prompts/AuthorCard.tsx` (NEW)

```typescript
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FollowButton } from '@/components/social/FollowButton';
import { Users } from 'lucide-react';

interface AuthorCardProps {
  author: {
    _id: string;
    name: string;
    username: string;
    image: string | null;
    bio: string | null;
    followerCount: number;
  };
  locale: string;
}

export function AuthorCard({ author, locale }: AuthorCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <Link href={`/${locale}/profile/${author.username}`} className="flex items-center gap-3 mb-3 group">
        {/* Avatar */}
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name}
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {author.name[0]?.toUpperCase()}
          </div>
        )}
        {/* Name + username */}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
            {author.name}
          </p>
          <p className="text-xs text-gray-400">@{author.username}</p>
        </div>
      </Link>

      {/* Bio */}
      {author.bio && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{author.bio}</p>
      )}

      {/* Follower count + Follow button */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Users size={12} />
          {author.followerCount.toLocaleString()} followers
        </span>
        <FollowButton username={author.username} targetUserId={author._id} />
      </div>
    </div>
  );
}
```

### 사이드바 위치 (page.tsx)

```tsx
<aside className="lg:w-80 shrink-0 space-y-4">
  {/* Author Card — 최상단 NEW */}
  {authorData && <AuthorCard author={authorData} locale={locale} />}

  <AdBanner adSlot="4444444444" adFormat="rectangle" />

  {/* Tags — 기존 */}
  ...
  {/* Stats — 기존 */}
  ...
</aside>
```

---

## FR-04: 편집 버튼

`page.tsx`는 Server Component이므로 `getServerSession`으로 현재 유저 확인:

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Pencil } from 'lucide-react';

// page 함수 내부 추가
const session = await getServerSession(authOptions);
const isAuthor = session?.user && (session.user as any).id === p.author;
```

**편집 페이지 존재 여부**: `/app/[locale]/prompts/new/page.tsx`만 있고 edit 페이지 없음.
→ edit 페이지 없으므로 **편집 버튼은 이번 사이클 제외** (별도 사이클로 분리).

---

## File Manifest

| 파일 | 액션 | 변경 내용 |
|------|------|-----------|
| `app/[locale]/prompts/[id]/page.tsx` | MOD | getAuthor + getRelatedPrompts 쿼리 추가, ShareButtons/AuthorCard/RelatedPrompts 렌더 |
| `components/prompts/ShareButtons.tsx` | NEW | 링크 복사 + X 공유 버튼 |
| `components/prompts/RelatedPrompts.tsx` | NEW | 같은 카테고리 4개 PromptCard grid |
| `components/prompts/AuthorCard.tsx` | NEW | 작성자 카드 (아바타, bio, follower, FollowButton) |

**총 4개 파일** (NEW 3 + MOD 1)
※ FR-04 편집 버튼 — edit 페이지 미존재로 이번 사이클 제외

---

## Implementation Order

1. `components/prompts/ShareButtons.tsx` — 독립 컴포넌트, 의존성 없음
2. `components/prompts/AuthorCard.tsx` — FollowButton 재사용
3. `components/prompts/RelatedPrompts.tsx` — PromptCard 재사용
4. `app/[locale]/prompts/[id]/page.tsx` — 위 3개 컴포넌트 통합

---

## Type Summary

```typescript
// RelatedPrompts에서 사용 (PromptCard의 prompt prop과 동일)
interface RelatedPrompt {
  _id: string;
  title: string;
  description?: string;
  aiTool: string;
  category: string;
  resultImages: string[];
  authorName: string;
  authorUsername: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  slug: string;
}

// AuthorCard의 author prop
interface AuthorData {
  _id: string;
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
  followerCount: number;
}
```

---

## Error Handling

| 상황 | 처리 |
|------|------|
| author User 없음 | `getAuthor` → null → `AuthorCard` 미렌더 |
| 관련 프롬프트 없음 | `RelatedPrompts` → `if (prompts.length === 0) return null` |
| 클립보드 API 실패 | `ShareButtons` — try/catch 묵음 처리 |
| X 공유 팝업 차단 | `window.open` 실패 시 그냥 무시 |
