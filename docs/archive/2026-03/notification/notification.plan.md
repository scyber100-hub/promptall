# Plan: notification

## Overview
알림 시스템 완성. 핵심 인프라(모델, API, UI, 이벤트 트리거)는 **이미 완전 구현**되어 있음.
남은 작업은 버그 2개 수정 + 사소한 UX 개선으로 범위가 매우 작다.

## Current State Analysis

### 이미 구현됨 ✅ (완전 작동)
- `models/UserNotification.ts` — follow, like, comment, comment_reply 타입, TTL 90일, 인덱스 3개
- `lib/notifications.ts` — `createNotification()` (자기 자신 알림 방지 포함)
- `GET /api/notifications` — 페이지네이션 목록 (page+limit)
- `GET /api/notifications/unread-count` — 미읽음 카운트 (30초 폴링)
- `PATCH /api/notifications/read` — 전체 읽음 처리
- `PATCH /api/notifications/[id]/read` — 개별 읽음 처리
- `components/notifications/NotificationBadge.tsx` — 벨 아이콘 + 빨간 뱃지, Header에 마운트됨
- `components/notifications/NotificationItem.tsx` — 아바타, 타입별 아이콘, timeAgo, 링크
- `app/[locale]/notifications/page.tsx` — 알림 목록 페이지 (전체 읽음 버튼, 개별 읽음)
- **이벤트 트리거** — follow, like, comment 모두 `createNotification()` 호출 완료
- JWT 세션 — `id`, `username`, `role` 포함 (알림 생성 시 필요한 정보)

### 미구현 / 버그 (이번 사이클 대상) ❌

#### BUG-01: admin/notifications 잘못된 모델 참조
- `app/api/admin/notifications/route.ts`가 `@/models/Notification` import
- 해당 모델 파일이 존재하지 않음 → 런타임 에러 (`models/Notification` ≠ `models/UserNotification`)
- **수정**: import를 `UserNotification`으로 교체

#### BUG-02: actorImage 누락 가능성 (이메일 로그인 유저)
- JWT 콜백에 `image`를 명시 저장하지 않음 (id, username, role만 저장)
- 이메일 가입 후 아바타 설정 시 세션 갱신이 안 되면 알림 생성 시 actorImage 누락
- **수정**: JWT 콜백에 `token.image = user.image ?? token.image` 추가

#### FR-01: 알림 발생 시 `User.likeCount` 업데이트 누락
- 좋아요 시 `Prompt.likeCount`는 업데이트하지만 `User.likeCount` (받은 총 좋아요)는 업데이트 안 함
- user-profile 사이클에서 likeCount 표시를 추가했으나 값이 항상 0
- **수정**: like API에서 `User.findByIdAndUpdate(prompt.author, { $inc: { likeCount: ±1 } })` 추가

## Problem Statement
- 알림 시스템은 작동하지만 admin 페이지에서 런타임 에러 발생 (잘못된 모델)
- 이메일 유저의 actorImage가 알림에 안 들어올 수 있음
- user-profile에 추가한 likeCount가 실제로 증가하지 않음 (카운터 업데이트 누락)

## Goals
1. BUG-01: admin/notifications 모델 참조 수정
2. BUG-02: JWT 콜백에 image 추가
3. FR-01: like API에서 User.likeCount 동기화

## Non-Goals
- 실시간 알림 (WebSocket/SSE) — 현재 30초 폴링으로 충분
- 알림 설정 (타입별 on/off)
- 이메일 알림
- 알림 그룹핑 (같은 유저 중복 알림 병합)

## Functional Requirements

### BUG-01: admin/notifications 모델 수정
- `app/api/admin/notifications/route.ts`
- `import Notification from '@/models/Notification'` → `import UserNotification from '@/models/UserNotification'`
- 이후 코드에서 `Notification.find()` → `UserNotification.find()` 등 전체 교체

### BUG-02: JWT image 저장
- `lib/auth.ts` jwt 콜백
- `if (user)` 블록에 `token.image = (user as any).image ?? undefined;` 추가
- `session` 콜백에 `token.image` → `session.user.image` 전달 (기존에 있는지 확인 필요)

### FR-01: User.likeCount 동기화
- `app/api/prompts/[id]/like/route.ts`
- 좋아요 추가 시: `User.findByIdAndUpdate(prompt.author, { $inc: { likeCount: 1 } })`
- 좋아요 취소 시: `User.findByIdAndUpdate(prompt.author, { $inc: { likeCount: -1 } }, { new: true, min: { likeCount: 0 } })`
- (음수 방지: `$max` 또는 조건부 처리)

## Tech Stack
- Next.js 16 App Router
- MongoDB/Mongoose
- NextAuth v4 JWT 전략

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `app/api/admin/notifications/route.ts` | MOD | Notification → UserNotification |
| `lib/auth.ts` | MOD | jwt 콜백에 image 추가 |
| `app/api/prompts/[id]/like/route.ts` | MOD | User.likeCount 동기화 |

**총 3개 파일** (MOD 3)

## Success Criteria
- admin/notifications 페이지에서 런타임 에러 없이 알림 목록 조회
- 이메일 유저가 좋아요/팔로우 시 actorImage 포함된 알림 생성
- 좋아요 누를 때마다 프롬프트 작성자의 profile likeCount 증가

## Priority
Medium — 버그 수정 + 데이터 정합성

## Estimated Scope
XSmall (MOD 3, 각 파일 5줄 이내 변경)
