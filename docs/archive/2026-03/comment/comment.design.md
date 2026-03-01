# Design: comment

## Overview

댓글 시스템 UX 완성 및 API 직렬화 수정. 3개 파일 수정.

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `components/social/CommentSection.tsx` | MOD | 아바타 표시 + 답글 삭제 |
| `app/api/prompts/[id]/comments/route.ts` | MOD | GET 직렬화 수정 |
| `app/api/comments/route.ts` | MOD | POST 응답 직렬화 수정 |

---

## File 1: `components/social/CommentSection.tsx` (MOD)

### BUG-01: 아바타 표시

**변경 위치**: 댓글 헤더 (현재 L131-135), 답글 헤더 (현재 L187-190)

**댓글 헤더 — 현재:**
```tsx
<div className="flex items-start justify-between">
  <div className="flex items-center gap-2 mb-2">
    <span className="font-medium text-sm text-gray-900">@{comment.authorUsername}</span>
    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
  </div>
```

**댓글 헤더 — 변경 후:**
```tsx
<div className="flex items-start justify-between">
  <div className="flex items-center gap-2 mb-2">
    {comment.authorImage ? (
      <Image src={comment.authorImage} alt={comment.authorUsername} width={24} height={24} className="rounded-full object-cover" />
    ) : (
      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
        {comment.authorUsername.charAt(0).toUpperCase()}
      </div>
    )}
    <span className="font-medium text-sm text-gray-900">@{comment.authorUsername}</span>
    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
  </div>
```

**답글 헤더 — 현재:**
```tsx
<div key={reply._id} className="mt-3 pl-4 border-l-2 border-gray-200">
  <div className="flex items-center gap-2 mb-1">
    <span className="font-medium text-xs text-gray-900">@{reply.authorUsername}</span>
    <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
  </div>
  <p className="text-sm text-gray-700">{reply.content}</p>
</div>
```

**답글 헤더 — 변경 후 (BUG-01 + BUG-02 동시 적용):**
```tsx
<div key={reply._id} className="mt-3 pl-4 border-l-2 border-gray-200">
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-2 mb-1">
      {reply.authorImage ? (
        <Image src={reply.authorImage} alt={reply.authorUsername} width={20} height={20} className="rounded-full object-cover" />
      ) : (
        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
          {reply.authorUsername.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="font-medium text-xs text-gray-900">@{reply.authorUsername}</span>
      <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
    </div>
    {username === reply.authorUsername && (
      <button onClick={() => deleteReply(reply._id, comment._id)} className="text-gray-400 hover:text-red-500">
        <Trash2 size={12} />
      </button>
    )}
  </div>
  <p className="text-sm text-gray-700">{reply.content}</p>
</div>
```

### BUG-02: 답글 삭제 함수 추가

**변경 위치**: `deleteComment` 함수(L82-86) 바로 다음에 추가

**추가할 코드:**
```ts
const deleteReply = async (replyId: string, parentId: string) => {
  if (!confirm(t('common.delete'))) return;
  await fetch(`/api/comments/${replyId}`, { method: 'DELETE' });
  setReplies((prev) => ({
    ...prev,
    [parentId]: (prev[parentId] || []).filter((r) => r._id !== replyId),
  }));
};
```

---

## File 2: `app/api/prompts/[id]/comments/route.ts` (MOD)

### BUG-03: GET 직렬화

**현재 (L18-23):**
```ts
const comments = await Comment.find(query)
  .sort({ createdAt: -1 })
  .limit(50)
  .lean();

return NextResponse.json({ comments });
```

**변경 후:**
```ts
const raw = await Comment.find(query)
  .sort({ createdAt: -1 })
  .limit(50)
  .lean();

const comments = raw.map((c: any) => ({
  _id: c._id.toString(),
  authorName: c.authorName,
  authorUsername: c.authorUsername,
  authorImage: c.authorImage ?? undefined,
  content: c.content,
  replyCount: c.replyCount ?? 0,
  parentId: c.parentId?.toString(),
  createdAt: c.createdAt?.toISOString() ?? '',
}));

return NextResponse.json({ comments });
```

---

## File 3: `app/api/comments/route.ts` (MOD)

### BUG-03: POST 응답 직렬화

**현재 (L69):**
```ts
return NextResponse.json({ comment }, { status: 201 });
```

**변경 후:**
```ts
return NextResponse.json({
  comment: {
    _id: comment._id.toString(),
    authorName: comment.authorName,
    authorUsername: comment.authorUsername,
    authorImage: comment.authorImage ?? undefined,
    content: comment.content,
    replyCount: comment.replyCount,
    parentId: comment.parentId?.toString(),
    createdAt: comment.createdAt.toISOString(),
  },
}, { status: 201 });
```

---

## Design Requirements Checklist

### BUG-01: 아바타 표시 (CommentSection.tsx)

| # | Requirement | Detail |
|---|-------------|--------|
| R01 | 댓글 아바타 — Image 표시 | `comment.authorImage`가 있으면 `<Image width={24} height={24} className="rounded-full object-cover" />` |
| R02 | 댓글 아바타 — fallback | `authorImage` 없으면 `w-6 h-6` 원형 div에 `authorUsername.charAt(0).toUpperCase()` |
| R03 | 답글 아바타 — Image 표시 | `reply.authorImage`가 있으면 `<Image width={20} height={20} className="rounded-full object-cover" />` |
| R04 | 답글 아바타 — fallback | `authorImage` 없으면 `w-5 h-5` 원형 div에 이니셜 |

### BUG-02: 답글 삭제 (CommentSection.tsx)

| # | Requirement | Detail |
|---|-------------|--------|
| R05 | `deleteReply` 함수 추가 | `(replyId: string, parentId: string)` 시그니처 |
| R06 | `deleteReply` — confirm | `confirm(t('common.delete'))` |
| R07 | `deleteReply` — API 호출 | `DELETE /api/comments/${replyId}` |
| R08 | `deleteReply` — 상태 업데이트 | `setReplies(prev => ({ ...prev, [parentId]: prev[parentId].filter(r => r._id !== replyId) }))` |
| R09 | 답글 삭제 버튼 | `username === reply.authorUsername` 조건부 렌더 |
| R10 | 답글 삭제 버튼 — 아이콘 | `<Trash2 size={12} />` |

### BUG-03: API 직렬화

| # | Requirement | Detail |
|---|-------------|--------|
| R11 | GET — `_id.toString()` | `c._id.toString()` |
| R12 | GET — `createdAt.toISOString()` | `c.createdAt?.toISOString() ?? ''` |
| R13 | GET — `parentId?.toString()` | optional chaining |
| R14 | GET — `authorImage ?? undefined` | null 제거 |
| R15 | POST — `_id.toString()` | `comment._id.toString()` |
| R16 | POST — `createdAt.toISOString()` | `comment.createdAt.toISOString()` |
| R17 | POST — `parentId?.toString()` | optional chaining |
| R18 | POST — plain object 반환 | Mongoose Document 대신 직렬화된 plain object |

**Grand Total: 18 requirements**

---

## Tech Stack

- Next.js 16 App Router
- next/image (아바타)
- MongoDB/Mongoose 직렬화 convention

## Success Criteria

- 댓글/답글 목록에 아바타(또는 이니셜) 표시
- 답글 작성자 본인이 자신의 답글 삭제 가능
- GET/POST 응답 `_id` → string, `createdAt` → ISO string
