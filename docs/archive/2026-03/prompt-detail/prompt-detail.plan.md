# Plan: prompt-detail

## Overview
프롬프트 상세 페이지 강화. 핵심 뷰/액션(복사, 좋아요, 북마크, 댓글)은 이미 구현됨.
사용자 체류 시간과 재방문율을 높이는 관련 콘텐츠 추천, 작성자 카드, 공유 기능, 편집 버튼을 추가한다.

## Current State Analysis

### 이미 구현됨 ✅
- `app/[locale]/prompts/[id]/page.tsx` — 프롬프트 상세 (slug/id 조회)
- 프롬프트 본문 — 다크 코드 블록 + `CopyPromptButton` (게스트 3회 제한)
- 소셜 액션 — `LikeButton`, `BookmarkButton`, `AddToCollectionButton`, `ReportButton`
- 댓글 섹션 — `CommentSection` (대댓글, 삭제 지원)
- 결과 콘텐츠 — `resultImages`, `resultLink`, `resultText`
- 사이드바 — Tags (검색 링크), Stats (likes/comments/views/copies)
- 메타데이터 — OpenGraph, Twitter Card, JSON-LD (Article)
- 광고 배너 — `AdBanner` (horizontal + rectangle)
- `FollowButton` 컴포넌트 — `components/social/FollowButton.tsx` (이미 존재)

### 미구현 (이번 사이클 대상) ❌
- **관련 프롬프트** — 같은 카테고리/같은 작성자의 다른 프롬프트 추천 없음
- **소셜 공유** — 링크 복사, X(Twitter) 공유 버튼 없음
- **작성자 카드** — 사이드바에 작성자 프로필 카드/팔로우 버튼 없음 (텍스트 링크만)
- **편집 버튼** — 작성자 본인이 상세 페이지에서 편집으로 이동 불가

## Problem Statement
- 프롬프트를 본 후 관련 콘텐츠로 이동할 경로가 없어 이탈률이 높음
- 마음에 드는 프롬프트를 SNS나 링크로 공유할 방법이 없음
- 작성자 팔로우를 하려면 프로필 페이지로 직접 이동해야 함
- 작성자가 본인 프롬프트를 수정하려면 마이페이지에서 찾아야 함

## Goals
1. 페이지 하단에 관련 프롬프트 카드 섹션 추가 (같은 카테고리 4개)
2. 소셜 공유 버튼 추가 (링크 복사, X 공유)
3. 사이드바 상단에 작성자 프로필 카드 추가 (팔로우 버튼 포함)
4. 작성자 본인에게 편집 버튼 표시

## Non-Goals
- 프롬프트 변수 인터랙티브 채우기 (별도 복잡한 기능)
- 알고리즘 추천 (ML 기반, 현재 범위 초과)
- 조회수 기반 인기 프롬프트 섹션 (별도 사이클)
- 댓글 좋아요 기능

## Functional Requirements

### FR-01: 관련 프롬프트 섹션
- 위치: 댓글 섹션 위 (또는 페이지 하단)
- 로직: 같은 `category`의 프롬프트 4개, `likeCount` 내림차순, 현재 프롬프트 제외
- DB 쿼리: `Prompt.find({ category, status: 'active', _id: { $ne: currentId } }).sort({ likeCount: -1 }).limit(4).select(...).lean()`
- UI: 기존 `PromptCard` 컴포넌트 재사용 또는 간략 카드 (4열 grid)
- 결과 없으면 섹션 미표시

### FR-02: 소셜 공유 버튼
- 위치: 액션 버튼 row (LikeButton 옆)
- 버튼 1: **링크 복사** — `navigator.clipboard.writeText(window.location.href)` → 2초간 "Copied!" 표시
- 버튼 2: **X(Twitter) 공유** — `https://x.com/intent/tweet?url=...&text=...` 새 탭
- 컴포넌트: `ShareButtons.tsx` (신규, Client Component)
- `locale` prop 불필요 (window.location 사용)

### FR-03: 작성자 카드 (사이드바)
- 위치: 사이드바 최상단 (AdBanner 위)
- 데이터: `authorName`, `authorUsername`, `authorImage?`, 팔로워 수
- User 모델에서 팔로워 수 추가 조회 (`User.findOne({ username: authorUsername }).select('followersCount bio').lean()`)
- UI:
  ```
  ┌─────────────────────────────┐
  │ [Avatar] authorName         │
  │          @authorUsername    │
  │ bio (1줄 truncate)          │
  │ [Follow] 팔로워 N명          │
  └─────────────────────────────┘
  ```
- `FollowButton` 컴포넌트 재사용 (이미 존재)
- 본인 프롬프트면 Follow 버튼 숨김

### FR-04: 편집 버튼
- 위치: 액션 버튼 row, `session.user.id === p.author` 일 때만 표시
- `<Link href={`/${locale}/prompts/${p._id}/edit`}>` — Edit 아이콘 + 텍스트
- 편집 페이지 자체는 이미 존재 여부 확인 필요, 없으면 이번 사이클 제외

## Tech Stack
- Next.js 16 App Router (Server Component — page.tsx)
- MongoDB/Mongoose
- Tailwind CSS v4
- lucide-react (Link2, Twitter, Pencil 아이콘)

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `app/[locale]/prompts/[id]/page.tsx` | MOD | 관련 프롬프트 쿼리, 작성자 카드 데이터, 편집 버튼 조건부 |
| `components/prompts/ShareButtons.tsx` | NEW | 링크 복사 + X 공유 버튼 |
| `components/prompts/RelatedPrompts.tsx` | NEW | 관련 프롬프트 4개 카드 그리드 |
| `components/prompts/AuthorCard.tsx` | NEW | 작성자 프로필 카드 (사이드바용) |

**총 4개 파일** (NEW 3 + MOD 1)

## Success Criteria
- 같은 카테고리 관련 프롬프트 최대 4개가 페이지에 표시됨
- "링크 복사" 클릭 시 클립보드에 URL 저장, "Copied!" 피드백
- "X 공유" 클릭 시 X 공유 창 열림
- 사이드바에 작성자 아바타, 이름, bio, 팔로워 수, 팔로우 버튼 표시
- 로그인한 작성자 본인에게 편집 버튼 표시

## Priority
Medium — UX 개선, 사용자 체류 시간 및 재방문율 향상

## Estimated Scope
Small-Medium (NEW 3 + MOD 1, 기존 컴포넌트 재사용 많음)
