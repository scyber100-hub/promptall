# Plan: comment

## Overview

댓글 시스템 UX 완성 및 API 직렬화 수정.
핵심 인프라(모델, API 3개, CommentSection 컴포넌트, prompt-detail 마운트)는 **이미 완전 구현**됨.
남은 작업은 UI 버그 2개 수정 + API 직렬화 convention 준수로 범위가 매우 작다.

## Current State Analysis

### 이미 구현됨 ✅ (완전 작동)

- `models/Comment.ts` — parentId, replyCount, likeCount, status, timestamps, 인덱스
- `POST /api/comments` — 댓글/답글 생성, commentCount/replyCount 업데이트, 알림 트리거
- `DELETE /api/comments/[id]` — soft delete, 작성자+admin만 삭제 가능, 카운터 복구
- `GET /api/prompts/[id]/comments` — parentId 필터로 댓글/답글 분리 조회
- `CommentSection.tsx` — 댓글 폼, 제출, 답글 폼, 답글 로드 (토글), 삭제
- `app/[locale]/prompts/[id]/page.tsx` L293 — `<CommentSection>` 마운트됨
- 알림 연동 — comment/comment_reply 타입 `createNotification()` 호출 완료

### 미구현 / 버그 (이번 사이클 대상) ❌

#### BUG-01: 아바타 미표시
- `Comment` 인터페이스에 `authorImage?` 필드 정의됨
- API GET 응답에 `authorImage` 포함됨
- CommentSection 렌더에서 `authorImage`를 **전혀 사용하지 않음**
- 결과: 댓글 목록에 아바타가 없음 (텍스트 `@username`만 표시)

#### BUG-02: 답글 삭제 불가
- 최상위 댓글은 삭제 버튼(`Trash2`) + `deleteComment()` 핸들러 있음
- 답글(`replies[comment._id]` 배열)은 삭제 버튼 **없음**, 핸들러 **없음**
- `DELETE /api/comments/[id]` API는 답글 삭제 지원하나 UI에서 호출 불가

#### BUG-03: API 직렬화 convention 미준수
- `GET /api/prompts/[id]/comments` — `.lean()` 후 `_id`, `createdAt` 미직렬화
- `POST /api/comments` — `Comment.create()` 반환값(Mongoose Document)을 그대로 응답
- 프로젝트 convention: `.lean()` + `_id.toString()` + `createdAt.toISOString()` 필수

## Problem Statement

- 댓글에 아바타가 없어 UI가 빈약함 (authorImage 데이터는 있음)
- 답글 작성자가 자신의 답글을 삭제할 수 없음
- API 응답이 프로젝트 직렬화 convention을 따르지 않아 잠재적 버그 위험

## Goals

1. BUG-01: CommentSection에 아바타 표시 추가
2. BUG-02: 답글 삭제 버튼 + 핸들러 추가
3. BUG-03: GET/POST 댓글 API 직렬화 수정

## Non-Goals

- 댓글 좋아요 (likeCount 필드 있으나 이번 사이클 제외)
- 댓글 페이지네이션 (현재 limit 50으로 충분)
- 댓글 수정 기능
- 댓글 신고 기능

## Functional Requirements

### BUG-01: 아바타 표시
- `components/social/CommentSection.tsx`
- 댓글 헤더에 `authorImage`가 있으면 `<Image>`, 없으면 이니셜 fallback 표시
- 답글에도 동일하게 적용
- `Image` import: `next/image` (이미 프로젝트 전체에서 사용 중)

### BUG-02: 답글 삭제
- `components/social/CommentSection.tsx`
- `deleteReply(replyId, parentId)` 함수 추가
  - `DELETE /api/comments/${replyId}` 호출
  - 성공 시 `replies[parentId]` 에서 해당 reply 제거
- 답글 렌더 블록에 삭제 버튼 추가 (작성자 본인만 표시)

### BUG-03: API 직렬화
- `app/api/prompts/[id]/comments/route.ts` (GET)
  - `serializeComment()` 헬퍼 또는 inline 직렬화: `_id.toString()`, `createdAt.toISOString()`
- `app/api/comments/route.ts` (POST)
  - `Comment.create()` 후 `.lean()` 재조회 또는 document `.toObject()` 직렬화

## Tech Stack

- Next.js 16 App Router
- MongoDB/Mongoose
- next/image (아바타)

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `components/social/CommentSection.tsx` | MOD | 아바타 표시 + 답글 삭제 |
| `app/api/prompts/[id]/comments/route.ts` | MOD | GET 직렬화 수정 |
| `app/api/comments/route.ts` | MOD | POST 응답 직렬화 수정 |

**총 3개 파일** (MOD 3)

## Success Criteria

- 댓글/답글 목록에 아바타(또는 이니셜 fallback) 표시
- 답글 작성자 본인이 자신의 답글 삭제 가능
- GET/POST 응답의 `_id`가 string, `createdAt`이 ISO string

## Priority

Medium — UX 완성도 + 코드 convention 준수

## Estimated Scope

XSmall (MOD 3, 각 파일 20줄 이내 변경)
