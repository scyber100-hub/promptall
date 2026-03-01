# Plan: user-notifications
> PDCA Cycle #4 | PromptAll

## Overview
사용자 간 소셜 인터랙션(팔로우, 좋아요, 댓글)이 발생할 때 수신자에게 인앱 알림을 전달하는 기능.
현재 `Notification` 모델은 어드민 전용(`high_report` / `new_user` / `prompt_hidden`)이므로
유저용 `UserNotification` 모델을 별도 신설한다.

## Background
- Cycle #3에서 팔로우 / 팔로워 카운트, 팔로우 피드, Collections 기능 완성
- 팔로우·좋아요·댓글 발생 시 상대방이 인지할 수단이 없음
- 헤더에 알림 뱃지 없음 (Bell 아이콘 미존재)

## Feature Requests

### FR-01: UserNotification 모델
**목표**: 유저 대상 알림 데이터를 저장하는 Mongoose 모델 신설

**필드 설계**:
```
recipient   : ObjectId (ref: User) — 알림 수신자
actor       : ObjectId (ref: User) — 행위자 (팔로우한 사람, 좋아요한 사람 등)
type        : 'follow' | 'like' | 'comment' | 'comment_reply'
promptId?   : ObjectId (ref: Prompt) — like·comment 시 연결
promptTitle?: String — 비정규화 저장 (조인 없이 표시)
read        : Boolean (default: false)
createdAt   : Date
```
**인덱스**: `{ recipient, read, createdAt }`, `{ recipient, createdAt }` (TTL 90일)

---

### FR-02: 알림 생성 트리거
**목표**: 기존 API에 알림 생성 로직을 side-effect로 연동

| 트리거 API | 알림 type | 수신자 | 내용 |
|-----------|---------|-------|------|
| `POST /api/users/[username]/follow` (팔로우 시) | `follow` | 팔로우 당한 사람 | "{actor}님이 팔로우했습니다" |
| `POST /api/prompts/[id]/like` (좋아요 시) | `like` | 프롬프트 작성자 | "{actor}님이 좋아요를 눌렀습니다" |
| `POST /api/comments` (댓글 작성 시) | `comment` | 프롬프트 작성자 | "{actor}님이 댓글을 달았습니다" |
| `POST /api/comments` (대댓글 작성 시) | `comment_reply` | 원댓글 작성자 | "{actor}님이 답글을 달았습니다" |

**규칙**:
- 자기 자신에게는 알림 생성 안 함 (actor === recipient skip)
- 언팔로우·좋아요 취소 시 알림 삭제 안 함 (단방향 append-only)
- 알림 생성 실패가 본 API 응답에 영향 주지 않도록 try-catch 분리

---

### FR-03: Notifications REST API
**목표**: 알림 목록 조회 + 읽음 처리 API

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/notifications` | 내 알림 목록 (최신순, 페이지네이션) |
| GET | `/api/notifications/unread-count` | 미읽음 수 (폴링용, lightweight) |
| PATCH | `/api/notifications/read` | 전체 읽음 처리 |
| PATCH | `/api/notifications/[id]/read` | 개별 읽음 처리 |

---

### FR-04: 헤더 알림 뱃지 (NotificationBadge)
**목표**: 로그인 상태 헤더에 Bell 아이콘 + 미읽음 수 뱃지 추가

- `components/notifications/NotificationBadge.tsx` (Client Component)
- 30초 폴링으로 `/api/notifications/unread-count` 호출
- 미읽음 수 > 0이면 빨간 뱃지 표시 (최대 99+)
- 클릭 시 `/[locale]/notifications` 페이지로 이동
- `Header.tsx`에 삽입 (Submit 버튼 왼쪽)

---

### FR-05: 알림 목록 페이지
**목표**: 알림을 타입별·시간별로 확인하고 읽음 처리할 수 있는 페이지

**경로**: `/[locale]/notifications`
**구성**:
- 알림 항목: actor 아바타 + 내용 + 시간 + 읽음 여부
- 클릭 시 해당 프롬프트 상세 또는 프로필로 이동 + 읽음 처리
- "모두 읽음" 버튼
- 빈 상태 메시지 처리

**locale 키 추가**: 6개 언어 `notifications` 네임스페이스

---

## Out of Scope
- Push 알림 (Web Push / FCM) — 추후 별도 사이클
- 이메일 알림 — 추후 별도 사이클
- 알림 설정 (on/off 토글) — 추후 별도 사이클

## Technical Constraints
- Next.js 16 App Router, MongoDB + Mongoose
- 알림 생성: fire-and-forget (Promise.resolve().then(() => createNotification(...)))
- 폴링 주기: 30초 (WebSocket / SSE 없음)
- TTL 인덱스: 90일 후 자동 삭제 (MongoDB TTL)

## Expected Files
**신규 (8개)**:
- `models/UserNotification.ts`
- `app/api/notifications/route.ts`
- `app/api/notifications/unread-count/route.ts`
- `app/api/notifications/read/route.ts`
- `app/api/notifications/[id]/read/route.ts`
- `components/notifications/NotificationBadge.tsx`
- `components/notifications/NotificationItem.tsx`
- `app/[locale]/notifications/page.tsx`

**수정 (4개)**:
- `app/api/users/[username]/follow/route.ts` — follow 알림 트리거
- `app/api/prompts/[id]/like/route.ts` — like 알림 트리거
- `app/api/comments/route.ts` — comment / comment_reply 알림 트리거
- `components/layout/Header.tsx` — NotificationBadge 삽입

**locale 수정 (6개)**: en, ko, ja, zh, es, fr

## Success Criteria
- 팔로우 발생 시 수신자 DB에 UserNotification 도큐먼트 생성됨
- 헤더 뱃지에 미읽음 수 표시됨 (최대 30초 지연)
- 알림 클릭 시 읽음 처리 + 대상 페이지 이동
- TypeScript 에러 0
