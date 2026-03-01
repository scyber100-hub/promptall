# Design: collections

## Overview

컬렉션 관리 UI 완성. NEW 2 + MOD 1, 총 3개 파일.

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `components/collections/CollectionManager.tsx` | NEW | 오너 전용 편집/삭제 Client Component |
| `components/collections/CollectionPromptGrid.tsx` | NEW | 프롬프트 그리드 + 제거 버튼 Client Component |
| `app/[locale]/collections/[slug]/page.tsx` | MOD | getServerSession 이동 + isOwner + 두 컴포넌트 마운트 |

---

## File 1: `components/collections/CollectionManager.tsx` (NEW)

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Check, X } from 'lucide-react';

interface CollectionManagerProps {
  slug: string;
  title: string;
  description?: string;
  isPublic: boolean;
  locale: string;
  ownerUsername: string;
}

export function CollectionManager({
  slug, title, description, isPublic, locale, ownerUsername,
}: CollectionManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [titleVal, setTitleVal] = useState(title);
  const [descVal, setDescVal] = useState(description ?? '');
  const [isPublicVal, setIsPublicVal] = useState(isPublic);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!titleVal.trim()) return;
    setLoading(true);
    await fetch(`/api/collections/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleVal, description: descVal, isPublic: isPublicVal }),
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this collection?')) return;
    await fetch(`/api/collections/${slug}`, { method: 'DELETE' });
    router.push(`/${locale}/profile/${ownerUsername}/collections`);
  };

  if (editing) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-3">
        <input
          value={titleVal}
          onChange={(e) => setTitleVal(e.target.value)}
          maxLength={100}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          value={descVal}
          onChange={(e) => setDescVal(e.target.value)}
          maxLength={500}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublicVal}
            onChange={(e) => setIsPublicVal(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
          />
          Public
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading || !titleVal.trim()}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <Check size={14} />
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
          >
            <X size={14} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Pencil size={14} />
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
}
```

---

## File 2: `components/collections/CollectionPromptGrid.tsx` (NEW)

```tsx
'use client';
import { useState } from 'react';
import { PromptCard } from '@/components/prompts/PromptCard';
import { X } from 'lucide-react';

interface Prompt {
  _id: string;
  [key: string]: any;
}

interface CollectionPromptGridProps {
  initialPrompts: Prompt[];
  slug: string;
  locale: string;
  isOwner: boolean;
}

export function CollectionPromptGrid({
  initialPrompts, slug, locale, isOwner,
}: CollectionPromptGridProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const handleRemove = async (promptId: string) => {
    setRemoving((prev) => new Set([...prev, promptId]));
    await fetch(`/api/collections/${slug}/prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId }),
    });
    setPrompts((prev) => prev.filter((p) => p._id !== promptId));
    setRemoving((prev) => { const s = new Set(prev); s.delete(promptId); return s; });
  };

  if (prompts.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-12">No prompts in this collection.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <div key={prompt._id} className="relative">
          <PromptCard prompt={prompt} locale={locale} />
          {isOwner && (
            <button
              onClick={() => handleRemove(prompt._id)}
              disabled={removing.has(prompt._id)}
              className="absolute top-2 right-2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 disabled:opacity-50 shadow-sm transition-colors"
              title="Remove from collection"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## File 3: `app/[locale]/collections/[slug]/page.tsx` (MOD)

### 변경 사항

**import 추가:**
```tsx
import { CollectionManager } from '@/components/collections/CollectionManager';
import { CollectionPromptGrid } from '@/components/collections/CollectionPromptGrid';
```

**`PromptCard` import 제거** (CollectionPromptGrid 내부에서 사용):
```tsx
// Before
import { PromptCard } from '@/components/prompts/PromptCard';
// After: 삭제
```

**`getServerSession` 호출 — 현재 (조건부):**
```tsx
if (!c.isPublic) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).id !== c.owner._id.toString()) {
    notFound();
  }
}
```

**변경 후 (무조건 호출, isOwner 계산):**
```tsx
const session = await getServerSession(authOptions);
if (!c.isPublic) {
  if (!session?.user || (session.user as any).id !== c.owner._id.toString()) {
    notFound();
  }
}
const isOwner = !!session?.user && (session.user as any).id === c.owner._id.toString();
```

**헤더 영역 — `<CollectionManager>` 추가:**
```tsx
{/* 기존 title/description/meta 블록 바로 아래 */}
{isOwner && (
  <CollectionManager
    slug={slug}
    title={c.title}
    description={c.description}
    isPublic={c.isPublic}
    locale={locale}
    ownerUsername={c.owner.username}
  />
)}
```

**프롬프트 그리드 — `<CollectionPromptGrid>`로 교체:**
```tsx
// Before
{prompts.length === 0 ? (
  <p className="text-gray-400 text-sm text-center py-12">{t('no_prompts')}</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {prompts.map((prompt: any) => (
      <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
    ))}
  </div>
)}

// After
<CollectionPromptGrid
  initialPrompts={prompts}
  slug={slug}
  locale={locale}
  isOwner={isOwner}
/>
```

---

## Design Requirements Checklist

### FR-01: CollectionManager.tsx (NEW)

| # | Requirement | Detail |
|---|-------------|--------|
| R01 | `'use client'` directive | 파일 첫 줄 |
| R02 | Props interface | `slug, title, description?, isPublic, locale, ownerUsername` |
| R03 | `editing` state | `useState(false)` |
| R04 | `titleVal` state | `useState(title)` |
| R05 | `descVal` state | `useState(description ?? '')` |
| R06 | `isPublicVal` state | `useState(isPublic)` |
| R07 | `loading` state | `useState(false)` |
| R08 | `handleSave` — PATCH | `fetch('/api/collections/${slug}', { method: 'PATCH', ... })` |
| R09 | `handleSave` — router.refresh() | 저장 후 페이지 새로고침 |
| R10 | `handleDelete` — confirm | `confirm('Delete this collection?')` |
| R11 | `handleDelete` — DELETE | `fetch('/api/collections/${slug}', { method: 'DELETE' })` |
| R12 | `handleDelete` — redirect | `router.push('/${locale}/profile/${ownerUsername}/collections')` |
| R13 | 편집 모드 UI | title input, description textarea, isPublic checkbox |
| R14 | 편집 모드 버튼 | Save(`<Check size={14}>`), Cancel(`<X size={14}>`) |
| R15 | 뷰 모드 버튼 | Edit(`<Pencil size={14}>`), Delete(`<Trash2 size={14}>`) |

### FR-02: CollectionPromptGrid.tsx (NEW)

| # | Requirement | Detail |
|---|-------------|--------|
| R16 | `'use client'` directive | 파일 첫 줄 |
| R17 | Props interface | `initialPrompts, slug, locale, isOwner` |
| R18 | `prompts` state | `useState<Prompt[]>(initialPrompts)` |
| R19 | `removing` state | `useState<Set<string>>(new Set())` |
| R20 | `handleRemove` — POST | `fetch('/api/collections/${slug}/prompts', { method: 'POST', ... })` |
| R21 | `handleRemove` — filter | `setPrompts(prev => prev.filter(p => p._id !== promptId))` |
| R22 | `handleRemove` — removing 관리 | add on start, delete on complete |
| R23 | isOwner X 버튼 | `absolute top-2 right-2 z-10 w-6 h-6` 원형 버튼 |
| R24 | X 버튼 아이콘 | `<X size={12} />` |
| R25 | `disabled` | `removing.has(prompt._id)` 시 비활성 |
| R26 | 빈 상태 메시지 | `prompts.length === 0` 시 텍스트 표시 |

### MOD: `app/[locale]/collections/[slug]/page.tsx`

| # | Requirement | Detail |
|---|-------------|--------|
| R27 | `CollectionManager` import | `@/components/collections/CollectionManager` |
| R28 | `CollectionPromptGrid` import | `@/components/collections/CollectionPromptGrid` |
| R29 | `getServerSession` 무조건 호출 | 조건부 블록 밖으로 이동 |
| R30 | `isOwner` 계산 | `!!session?.user && id === c.owner._id.toString()` |
| R31 | `{isOwner && <CollectionManager ... />}` | 헤더 영역 하단 |
| R32 | `<CollectionPromptGrid>` 교체 | 기존 prompts 그리드 대체 |

**Grand Total: 32 requirements**

---

## Tech Stack

- Next.js 16 App Router (Server + Client 혼합)
- `useRouter` from `next/navigation`
- lucide-react: `Pencil, Trash2, Check, X`

## Success Criteria

- 오너: Edit 버튼 → 인라인 폼 → 저장 → 페이지 반영
- 오너: Delete 버튼 → confirm → 컬렉션 목록으로 이동
- 오너: 각 프롬프트 카드 오른쪽 위 X → 즉시 제거
- 비오너: 기존 읽기 전용 그리드 유지
