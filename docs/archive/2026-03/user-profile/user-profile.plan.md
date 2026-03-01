# Plan: user-profile

## Overview
유저 프로필 페이지 UX 강화. 핵심 불편사항 3가지(아바타 업로드, stats 미표시, 프롬프트 고정 12개)를 해소하고 SEO와 slug 직렬화 버그를 수정한다.

## Current State Analysis

### 이미 구현됨 ✅
- `app/[locale]/profile/[username]/page.tsx` — 프로필 헤더(avatar, name, bio, followers/following/promptCount), 프롬프트 12개 그리드
- `app/[locale]/profile/[username]/followers/page.tsx` — 팔로워 목록
- `app/[locale]/profile/[username]/following/page.tsx` — 팔로잉 목록
- `app/[locale]/profile/[username]/collections/page.tsx` — 컬렉션 탭
- `app/[locale]/settings/profile/page.tsx` — 프로필 편집 (name, bio, image URL 입력)
- `PATCH /api/users/me` — name, bio, image 업데이트
- `POST /api/upload` — S3 이미지 업로드 (prompt-edit에서 재사용 확인됨)
- User 모델: `likeCount` 필드 존재 (현재 profile에서 미표시)

### 미구현 / 버그 (이번 사이클 대상) ❌
1. **아바타 이미지 직접 업로드** — 현재 URL 직접 입력 방식 (UX 불편)
2. **`likeCount` 미표시** — profile stats에 총 받은 좋아요 수 없음
3. **프롬프트 더 보기** — 12개 고정 (13번째 이후 볼 방법 없음)
4. **slug 직렬화 누락** — `getProfileData()`에서 `slug` 필드를 `.lean()` 후 직렬화 안 함 → PromptCard가 slug-based URL 사용 불가
5. **generateMetadata 없음** — profile 페이지 SEO 메타태그 부재

## Problem Statement
- 아바타를 바꾸려면 이미지를 외부에 올리고 URL을 복사해야 하는 번거로움
- 작성자의 인기도(likeCount)를 확인할 수 없어 profile 정보 불완전
- 활발한 작성자의 프롬프트 전체를 볼 방법이 없음 (12개 이후 단절)
- PromptCard가 `slug`를 URL에 사용하는데 profile 페이지에서 slug가 undefined

## Goals
1. settings/profile에 아바타 이미지 파일 업로드 추가 (기존 /api/upload 재사용)
2. profile 헤더에 likeCount (받은 좋아요) 표시
3. 프롬프트 "더 보기" 버튼 (12 → 24 → 36 … 무한 확장)
4. slug 직렬화 fix
5. generateMetadata 추가 (SEO)

## Non-Goals
- 팔로워/팔로잉 목록 UI 개선 (기존 유지)
- 프로필 배경 이미지/커버
- 사용자 차단 기능
- 프로필 공개/비공개 설정

## Functional Requirements

### FR-01: 아바타 이미지 파일 업로드 (`settings/profile/page.tsx`)
- 기존 이미지 URL 입력 필드 → 파일 업로드 버튼으로 교체
- `<input type="file" accept="image/*">` + `/api/upload` POST
- 업로드 중 로딩 상태 표시
- 업로드 완료 시 `image` state 업데이트 → avatar 미리보기 즉시 반영
- 기존 PATCH 흐름 유지 (name, bio, image URL을 서버에 저장)

### FR-02: Profile stats likeCount 표시 (`profile/[username]/page.tsx`)
- 헤더 stats row에 `Heart` 아이콘 + `{u.likeCount} likes` 추가
- promptCount, followers, following 옆에 나란히

### FR-03: 프롬프트 더 보기 (`profile/[username]/page.tsx`)
- 초기 12개 표시
- 하단 "더 보기" 버튼 클릭 시 API로 추가 12개 로드
- 모든 프롬프트 로드 완료 시 버튼 숨김
- **구현 방식**: Server Component → Client Component로 부분 전환 필요
  - OR: `page.tsx`는 Server Component 유지, 프롬프트 섹션만 Client Component 분리
  - **선택**: `ProfilePrompts` Client Component 분리 (`components/profile/ProfilePrompts.tsx`)
  - API: `GET /api/users/[username]/prompts?page=N&limit=12` (신규 or 기존 활용)

### FR-04: slug 직렬화 Fix (`profile/[username]/page.tsx`)
- `getProfileData()` 내 prompts 직렬화 시 `slug: p.slug ?? p._id.toString()` 추가
- PromptCard가 slug-based URL 사용 가능하도록

### FR-05: generateMetadata (`profile/[username]/page.tsx`)
- title: `{u.name} (@{u.username}) | PromptAll`
- description: `u.bio || "{u.name}'s prompts on PromptAll"`
- og:image: `u.image || '/opengraph-image'`

## Tech Stack
- Next.js 16 App Router (Server + Client Components 혼합)
- MongoDB/Mongoose
- NextAuth v4 (settings/profile: useSession)
- Tailwind CSS v4
- `/api/upload` 재사용 (S3)

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `app/[locale]/settings/profile/page.tsx` | MOD | 파일 업로드 버튼 추가, URL 입력 제거 |
| `app/[locale]/profile/[username]/page.tsx` | MOD | likeCount 표시, slug fix, generateMetadata, ProfilePrompts 사용 |
| `components/profile/ProfilePrompts.tsx` | NEW | 더 보기 Client Component |
| `app/api/users/[username]/prompts/route.ts` | NEW | 프롬프트 페이지네이션 API |

**총 4개 파일** (NEW 2 + MOD 2)

## Success Criteria
- 파일 선택으로 아바타 이미지 업로드 완료, 프리뷰 즉시 반영
- profile 헤더에 likeCount 표시
- "더 보기" 클릭 시 추가 프롬프트 로드 (12 → 24)
- PromptCard 클릭 시 slug-based URL로 이동
- profile 페이지 `<title>` 태그에 사용자 이름 포함

## Priority
Medium — UX 개선, 버그 수정 포함

## Estimated Scope
Small (NEW 2 + MOD 2, API 1개 신규 필요)
