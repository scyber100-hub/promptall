# Design: notification

## Overview

알림 시스템 버그 수정 및 likeCount 동기화. 총 2개 파일 수정 (각 10줄 이내).

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `app/api/admin/notifications/route.ts` | MOD | `Notification` → `UserNotification` 모델 교체 |
| `app/api/prompts/[id]/like/route.ts` | MOD | `User.likeCount` 동기화 추가 |

---

## File 1: `app/api/admin/notifications/route.ts` (MOD)

### 현재 상태

```ts
import Notification from '@/models/Notification';
// ...
const notifications = await Notification.find(query)...
const unreadCount = await Notification.countDocuments({ read: false });
// ...
await Notification.updateMany({}, { $set: { read: true } });
await Notification.updateMany({ _id: { $in: ids } }, { $set: { read: true } });
```

- `@/models/Notification` 파일이 존재하지 않음 → 런타임 에러

### 변경 사항

**L5**: import 교체

```ts
// Before
import Notification from '@/models/Notification';

// After
import UserNotification from '@/models/UserNotification';
```

**L23, L28**: GET 핸들러 내 모델 참조 교체

```ts
// Before
const notifications = await Notification.find(query)
  .sort({ createdAt: -1 })
  .limit(50)
  .lean();
const unreadCount = await Notification.countDocuments({ read: false });

// After
const notifications = await UserNotification.find(query)
  .sort({ createdAt: -1 })
  .limit(50)
  .lean();
const unreadCount = await UserNotification.countDocuments({ read: false });
```

**L44, L46**: PATCH 핸들러 내 모델 참조 교체

```ts
// Before
await Notification.updateMany({}, { $set: { read: true } });
// ...
await Notification.updateMany({ _id: { $in: ids } }, { $set: { read: true } });

// After
await UserNotification.updateMany({}, { $set: { read: true } });
// ...
await UserNotification.updateMany({ _id: { $in: ids } }, { $set: { read: true } });
```

### 완성 파일 (전체)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import UserNotification from '@/models/UserNotification';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const query = unreadOnly ? { read: false } : {};

    const notifications = await UserNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await UserNotification.countDocuments({ read: false });
    return NextResponse.json({ notifications, unreadCount });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await connectDB();
    const { ids } = await req.json();

    if (ids === 'all') {
      await UserNotification.updateMany({}, { $set: { read: true } });
    } else if (Array.isArray(ids)) {
      await UserNotification.updateMany({ _id: { $in: ids } }, { $set: { read: true } });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## File 2: `app/api/prompts/[id]/like/route.ts` (MOD)

### 현재 상태

```ts
import Like from '@/models/Like';
import Prompt from '@/models/Prompt';
import { createNotification } from '@/lib/notifications';
// User import 없음

// Unlike path (L26-34):
if (existing) {
  await Like.deleteOne({ _id: existing._id });
  const updated = await Prompt.findByIdAndUpdate(id, { $inc: { likeCount: -1 } }, { new: true });
  // User.likeCount 업데이트 없음
  return NextResponse.json({ liked: false });
}

// Like path (L35-54):
else {
  await Like.create(...);
  const updated = await Prompt.findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true });
  // User.likeCount 업데이트 없음
  createNotification({...}).catch(() => {});
  return NextResponse.json({ liked: true });
}
```

- `User.likeCount` 증감 처리 없음 → user-profile 페이지에서 항상 0 표시

### 변경 사항

**import 추가** (L6 다음):

```ts
import User from '@/models/User';
```

**Unlike path**: `Prompt.findByIdAndUpdate` 직후 User likeCount 감소 추가

```ts
// 추가 위치: L28 (Prompt 업데이트) 이후, return 이전
if (updated) {
  await User.findByIdAndUpdate(updated.author, { $inc: { likeCount: -1 } });
}
return NextResponse.json({ liked: false });
```

**Like path**: `createNotification` 호출 전 User likeCount 증가 추가

```ts
// 추가 위치: L37 (Prompt 업데이트) 이후, createNotification 이전
if (updated) {
  await User.findByIdAndUpdate(updated.author, { $inc: { likeCount: 1 } });
  // trendingScore 업데이트 (기존)
  await Prompt.findByIdAndUpdate(id, {
    $set: { trendingScore: updated.likeCount * 2 + updated.viewCount * 0.2 + updated.bookmarkCount * 1 },
  });
  createNotification({...}).catch(() => {});
}
```

### 완성 파일 (전체)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Like from '@/models/Like';
import Prompt from '@/models/Prompt';
import User from '@/models/User';
import { createNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;

    const existing = await Like.findOne({
      userId,
      targetId: id,
      targetType: 'prompt',
    });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      const updated = await Prompt.findByIdAndUpdate(id, { $inc: { likeCount: -1 } }, { new: true });
      if (updated) {
        await User.findByIdAndUpdate(updated.author, { $inc: { likeCount: -1 } });
        await Prompt.findByIdAndUpdate(id, {
          $set: { trendingScore: updated.likeCount * 2 + updated.viewCount * 0.2 + updated.bookmarkCount * 1 },
        });
      }
      return NextResponse.json({ liked: false });
    } else {
      await Like.create({ userId, targetId: id, targetType: 'prompt' });
      const updated = await Prompt.findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true });
      if (updated) {
        await User.findByIdAndUpdate(updated.author, { $inc: { likeCount: 1 } });
        await Prompt.findByIdAndUpdate(id, {
          $set: { trendingScore: updated.likeCount * 2 + updated.viewCount * 0.2 + updated.bookmarkCount * 1 },
        });
        createNotification({
          recipient: updated.author.toString(),
          actor: userId,
          actorName: (session.user as any).name ?? '',
          actorUsername: (session.user as any).username ?? '',
          actorImage: (session.user as any).image ?? undefined,
          type: 'like',
          promptId: id,
          promptTitle: updated.title,
          promptSlug: updated.slug,
        }).catch(() => {});
      }
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Design Requirements Checklist

### BUG-01: admin/notifications 모델 수정

| # | Requirement | Detail |
|---|-------------|--------|
| R01 | import 교체 | `@/models/Notification` → `@/models/UserNotification` |
| R02 | 변수명 교체 | `Notification.find()` → `UserNotification.find()` |
| R03 | 변수명 교체 | `Notification.countDocuments()` → `UserNotification.countDocuments()` |
| R04 | 변수명 교체 | `Notification.updateMany({})` → `UserNotification.updateMany({})` (ids === 'all') |
| R05 | 변수명 교체 | `Notification.updateMany({ _id: ... })` → `UserNotification.updateMany(...)` (Array) |

**Total: 5 requirements**

### FR-01: User.likeCount 동기화

| # | Requirement | Detail |
|---|-------------|--------|
| R06 | User import | `import User from '@/models/User'` 추가 |
| R07 | Unlike likeCount | `User.findByIdAndUpdate(updated.author, { $inc: { likeCount: -1 } })` |
| R08 | Unlike 위치 | `if (updated)` 블록 내, trendingScore 업데이트 추가 (기존에는 없었음) |
| R09 | Like likeCount | `User.findByIdAndUpdate(updated.author, { $inc: { likeCount: 1 } })` |
| R10 | Like 위치 | `if (updated)` 블록 내, trendingScore 업데이트 이전 |

**Total: 5 requirements**

**Grand Total: 10 requirements**

---

## Tech Stack

- Next.js 16 App Router (API Routes)
- MongoDB/Mongoose
- NextAuth v4

## Success Criteria

- admin/notifications GET/PATCH → 런타임 에러 없이 응답
- 좋아요 클릭 → `User.likeCount` +1, 취소 → -1
- user-profile 페이지에서 likeCount 실시간 반영
