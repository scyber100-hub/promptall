# Design: user-notifications
> PDCA Cycle #4 | PromptAll

## Architecture Overview

```
[Follow API]  ──┐
[Like API]    ──┼──► createNotification() (fire-and-forget)
[Comment API] ──┘         │
                          ▼
                  models/UserNotification.ts
                          │
                  ┌───────┴──────────────┐
                  ▼                      ▼
      GET /api/notifications   GET /api/notifications/unread-count
           (목록 조회)                (폴링용 경량)
                  │
          PATCH /api/notifications/read
          PATCH /api/notifications/[id]/read
                  │
     ┌────────────┴────────────┐
     ▼                         ▼
NotificationBadge.tsx    /[locale]/notifications
(Header 삽입, 30초 폴링)      (목록 페이지)
```

---

## FR-01: UserNotification 모델

### 파일: `models/UserNotification.ts`

```typescript
export type UserNotificationType = 'follow' | 'like' | 'comment' | 'comment_reply';

export interface IUserNotification extends Document {
  recipient: mongoose.Types.ObjectId;   // 알림 수신자 (User)
  actor: mongoose.Types.ObjectId;       // 행위자 (User)
  actorName: string;                    // 비정규화 — 조인 없이 표시
  actorUsername: string;                // 비정규화
  actorImage?: string;                  // 비정규화
  type: UserNotificationType;
  promptId?: mongoose.Types.ObjectId;   // like·comment 시
  promptTitle?: string;                 // 비정규화
  promptSlug?: string;                  // 비정규화 — 링크용
  read: boolean;                        // default: false
  createdAt: Date;
}
```

**인덱스**:
```typescript
// 내 알림 최신순 조회
{ recipient: 1, createdAt: -1 }

// 미읽음 카운트 (폴링)
{ recipient: 1, read: 1 }

// TTL — 90일 후 자동 삭제
{ createdAt: 1 }, expireAfterSeconds: 7776000
```

---

## FR-02: 알림 생성 유틸리티

### 파일: `lib/notifications.ts` (신규)

```typescript
// fire-and-forget helper — 호출부가 await 안 해도 됨
export async function createNotification(data: {
  recipient: string;
  actor: string;
  actorName: string;
  actorUsername: string;
  actorImage?: string;
  type: UserNotificationType;
  promptId?: string;
  promptTitle?: string;
  promptSlug?: string;
}): Promise<void>
```

**규칙**:
- `recipient === actor` 이면 즉시 return (자기 자신 알림 없음)
- `UserNotification.create(...)` 실패 시 console.error만 — throw 안 함

### 수정: `app/api/users/[username]/follow/route.ts`

팔로우 생성 분기 (`else` 블록) 끝에 추가:
```typescript
// fire-and-forget — await 없음
createNotification({
  recipient: target._id.toString(),
  actor: followerId,
  actorName: (session.user as any).name,
  actorUsername: (session.user as any).username,
  actorImage: (session.user as any).image,
  type: 'follow',
}).catch(() => {});
```

### 수정: `app/api/prompts/[id]/like/route.ts`

좋아요 생성 분기 (`else` 블록) — Prompt 작성자 조회 후 알림:
```typescript
// prompt.author 가 좋아요 수신자
createNotification({
  recipient: updated.author.toString(),
  actor: userId,
  actorName: (session.user as any).name,
  actorUsername: (session.user as any).username,
  actorImage: (session.user as any).image,
  type: 'like',
  promptId: id,
  promptTitle: updated.title,
  promptSlug: updated.slug,
}).catch(() => {});
```

### 수정: `app/api/comments/route.ts`

댓글 생성 후 (comment 도큐먼트 생성 직후):
```typescript
// 일반 댓글: 프롬프트 작성자에게
// 대댓글: 원댓글 작성자에게
const prompt = await Prompt.findById(promptId).select('author title slug').lean();
if (prompt) {
  const recipientId = parentId
    ? (await Comment.findById(parentId).select('author').lean() as any)?.author?.toString()
    : (prompt as any).author?.toString();

  if (recipientId) {
    createNotification({
      recipient: recipientId,
      actor: userId,
      actorName: user.name,
      actorUsername: user.username,
      actorImage: user.image ?? undefined,
      type: parentId ? 'comment_reply' : 'comment',
      promptId: promptId,
      promptTitle: (prompt as any).title,
      promptSlug: (prompt as any).slug,
    }).catch(() => {});
  }
}
```

---

## FR-03: Notifications API

### `app/api/notifications/route.ts` — GET

**Request**: `GET /api/notifications?page=1&limit=20`
**Auth**: required

**Response**:
```json
{
  "notifications": [
    {
      "_id": "...",
      "type": "follow",
      "actorName": "Alice",
      "actorUsername": "alice",
      "actorImage": "https://...",
      "promptId": null,
      "promptTitle": null,
      "promptSlug": null,
      "read": false,
      "createdAt": "2026-02-27T..."
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

**구현 포인트**:
```typescript
UserNotification.find({ recipient: userId })
  .sort({ createdAt: -1 })
  .skip(skip).limit(limit)
  .lean()
```

---

### `app/api/notifications/unread-count/route.ts` — GET

**Request**: `GET /api/notifications/unread-count`
**Auth**: required
**Response**: `{ "count": 5 }`
**구현**: `UserNotification.countDocuments({ recipient: userId, read: false })`

---

### `app/api/notifications/read/route.ts` — PATCH

**Request**: `PATCH /api/notifications/read`
**Auth**: required
**Response**: `{ "success": true }`
**구현**: `UserNotification.updateMany({ recipient: userId, read: false }, { $set: { read: true } })`

---

### `app/api/notifications/[id]/read/route.ts` — PATCH

**Request**: `PATCH /api/notifications/[id]/read`
**Auth**: required
**Response**: `{ "success": true }`
**구현**: `UserNotification.updateOne({ _id: id, recipient: userId }, { $set: { read: true } })`

---

## FR-04: NotificationBadge 컴포넌트

### `components/notifications/NotificationBadge.tsx`

```typescript
'use client'
// - useSession으로 로그인 확인
// - useEffect + setInterval(30000)으로 /api/notifications/unread-count 폴링
// - count > 0이면 빨간 뱃지 표시 (99+ 상한)
// - Bell 아이콘 (lucide-react)
// - Link href={`/${locale}/notifications`}
// - 페이지 진입 시 count 즉시 0으로 낙관적 업데이트

interface NotificationBadgeProps {
  locale: string;
}
```

**UI 스펙**:
```
[ 🔔 ]  ← 미읽음 0
[ 🔔 3 ]  ← 미읽음 3 (빨간 뱃지, 오른쪽 상단)
[ 🔔 99+ ]  ← 최대 표시
```

### `components/layout/Header.tsx` 수정

삽입 위치: Submit 버튼 왼쪽 (로그인 상태에서만 표시)
```tsx
{/* Notification Badge — 로그인 상태에서만 */}
<NotificationBadge locale={locale} />
```

---

## FR-05: 알림 목록 페이지

### `app/[locale]/notifications/page.tsx`

- **Server Component** + `export const dynamic = 'force-dynamic'`
- 첫 페이지 SSR, 이후 클라이언트 페이지네이션 (또는 전체 SSR로 단순화)
- 페이지 진입 시 자동 전체 읽음 처리 (`PATCH /api/notifications/read`)

### `components/notifications/NotificationItem.tsx`

```typescript
interface NotificationItemProps {
  notification: {
    _id: string;
    type: 'follow' | 'like' | 'comment' | 'comment_reply';
    actorName: string;
    actorUsername: string;
    actorImage?: string;
    promptTitle?: string;
    promptSlug?: string;
    read: boolean;
    createdAt: string;
  };
  locale: string;
}
```

**타입별 표시 텍스트** (locale 키 사용):
| type | 표시 |
|------|------|
| `follow` | `{actorName}님이 팔로우했습니다.` |
| `like` | `{actorName}님이 "{promptTitle}"에 좋아요를 눌렀습니다.` |
| `comment` | `{actorName}님이 "{promptTitle}"에 댓글을 달았습니다.` |
| `comment_reply` | `{actorName}님이 댓글에 답글을 달았습니다.` |

**클릭 동작**:
- `follow` → `/[locale]/profile/[actorUsername]`
- `like` / `comment` / `comment_reply` → `/[locale]/prompts/[promptSlug]`
- 클릭 시 `PATCH /api/notifications/[id]/read` 호출

---

## Locale 키 (`notifications` 네임스페이스)

모든 6개 언어 파일에 추가:

```json
"notifications": {
  "title": "Notifications",
  "mark_all_read": "Mark all as read",
  "no_notifications": "No notifications yet.",
  "follow": "{name} followed you.",
  "like": "{name} liked \"{title}\".",
  "comment": "{name} commented on \"{title}\".",
  "comment_reply": "{name} replied to your comment.",
  "just_now": "Just now",
  "minutes_ago": "{count}m ago",
  "hours_ago": "{count}h ago",
  "days_ago": "{count}d ago"
}
```

---

## 전체 파일 목록

### 신규 파일 (9개)
| 파일 | 설명 |
|------|------|
| `models/UserNotification.ts` | Mongoose 모델 + TTL 인덱스 |
| `lib/notifications.ts` | createNotification() 유틸 |
| `app/api/notifications/route.ts` | GET 목록 |
| `app/api/notifications/unread-count/route.ts` | GET 미읽음 수 |
| `app/api/notifications/read/route.ts` | PATCH 전체 읽음 |
| `app/api/notifications/[id]/read/route.ts` | PATCH 개별 읽음 |
| `components/notifications/NotificationBadge.tsx` | 헤더 뱃지 |
| `components/notifications/NotificationItem.tsx` | 알림 항목 컴포넌트 |
| `app/[locale]/notifications/page.tsx` | 알림 목록 페이지 |

### 수정 파일 (4개)
| 파일 | 변경 내용 |
|------|---------|
| `app/api/users/[username]/follow/route.ts` | 팔로우 시 createNotification 호출 |
| `app/api/prompts/[id]/like/route.ts` | 좋아요 시 createNotification 호출 |
| `app/api/comments/route.ts` | 댓글/대댓글 시 createNotification 호출 |
| `components/layout/Header.tsx` | NotificationBadge 컴포넌트 삽입 |

### Locale 수정 (6개)
`messages/en.json`, `ko.json`, `ja.json`, `zh.json`, `es.json`, `fr.json`

**총 19개 파일**
