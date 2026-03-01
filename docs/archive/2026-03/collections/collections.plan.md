# Plan: collections

## Overview

컬렉션 관리 UI 완성. API(PATCH/DELETE/prompts 토글)는 **이미 완전 구현**됨.
오너가 컬렉션 상세 페이지에서 편집·삭제·프롬프트 제거를 할 수 있는 UI가 없음.
2개 신규 Client Component + 1개 파일 수정으로 완성.

## Current State Analysis

### 이미 구현됨 ✅

- `POST /api/collections` — 컬렉션 생성
- `GET /api/collections/[slug]` — 컬렉션 조회 (populate owner)
- `PATCH /api/collections/[slug]` — 제목/설명/공개여부 수정
- `DELETE /api/collections/[slug]` — 컬렉션 삭제
- `POST /api/collections/[slug]/prompts` — 프롬프트 추가/제거 토글
- `AddToCollectionButton.tsx` — 프롬프트 상세에서 컬렉션 선택 드롭다운
- `collections/[slug]/page.tsx` — 컬렉션 상세 (Server Component, 오너 판별 없음)
- `collections/new/page.tsx` — 컬렉션 생성 폼
- `profile/[username]/collections/page.tsx` — 유저 컬렉션 목록

### 미구현 (이번 사이클 대상) ❌

#### FR-01: 컬렉션 편집/삭제 UI
- 오너가 제목·설명·공개여부 수정 가능한 편집 폼 없음
- 오너가 컬렉션 삭제 가능한 버튼 없음
- API(PATCH/DELETE)는 있으나 UI 호출 불가

#### FR-02: 프롬프트 제거 UI
- 컬렉션 상세 페이지에서 오너가 각 프롬프트를 제거 불가
- `POST /api/collections/[slug]/prompts`는 toggle이므로 제거 API는 이미 있음
- 상세 페이지가 Server Component라 interactivity 없음

## Goals

1. FR-01: 컬렉션 상세 페이지에 오너 전용 편집/삭제 UI 추가
2. FR-02: 컬렉션 상세 페이지에서 오너가 프롬프트 제거 가능

## Non-Goals

- 컬렉션 정렬/필터
- 컬렉션 협업 (멀티 오너)
- 컬렉션 공유 링크 복사

## Functional Requirements

### FR-01: CollectionManager 컴포넌트 (NEW)

- `components/collections/CollectionManager.tsx`
- `'use client'` — Client Component
- Props: `slug`, `title`, `description`, `isPublic`, `locale`
- 편집 모드 토글: 연필 버튼 클릭 시 인라인 폼 표시
- 편집 폼: `title` input, `description` textarea, `isPublic` checkbox
- 저장 시: `PATCH /api/collections/${slug}` 호출 → `router.refresh()`
- 삭제 버튼: `confirm()` 후 `DELETE /api/collections/${slug}` → `router.push(/${locale}/profile/${ownerUsername}/collections)`
- Props에 `ownerUsername` 추가 (redirect용)

### FR-02: CollectionPromptGrid 컴포넌트 (NEW)

- `components/collections/CollectionPromptGrid.tsx`
- `'use client'` — Client Component
- Props: `initialPrompts`, `slug`, `locale`, `isOwner`
- State: `prompts` (initialPrompts로 초기화)
- `isOwner`일 때 각 PromptCard 오른쪽 위에 X 버튼 오버레이 표시
- X 클릭 시: `POST /api/collections/${slug}/prompts` `{ promptId }` 호출
  - 응답 `{ added: false }` 확인 후 `prompts` 상태에서 해당 항목 제거
- `isOwner`가 false이면 기존 PromptCard 그리드 그대로 렌더

### MOD: `app/[locale]/collections/[slug]/page.tsx`

- `getServerSession(authOptions)` 추가 (기존 없음)
- `isOwner = session?.user && (session.user as any).id === c.owner._id.toString()` 계산
- 헤더 영역에 `isOwner`일 때 `<CollectionManager>` 마운트
- prompts 그리드를 `<CollectionPromptGrid>` 교체 (isOwner 전달)
- `c.owner._id.toString()` 직렬화 추가 (populate 결과)

## Tech Stack

- Next.js 16 App Router (Server + Client Component 혼합)
- MongoDB/Mongoose
- Tailwind CSS

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `components/collections/CollectionManager.tsx` | NEW | 편집/삭제 Client Component |
| `components/collections/CollectionPromptGrid.tsx` | NEW | 프롬프트 그리드 + 제거 Client Component |
| `app/[locale]/collections/[slug]/page.tsx` | MOD | getServerSession + isOwner + 두 컴포넌트 마운트 |

**총 3개 파일** (NEW 2, MOD 1)

## Success Criteria

- 오너가 컬렉션 상세 페이지에서 제목/설명/공개여부 수정 가능
- 오너가 컬렉션 삭제 후 자신의 컬렉션 목록으로 이동
- 오너가 각 프롬프트 위 X 버튼으로 컬렉션에서 제거 가능 (페이지 리로드 없이)
- 비오너는 기존 읽기 전용 뷰 그대로

## Priority

Medium — 핵심 CRUD 완성

## Estimated Scope

Small (NEW 2 + MOD 1)
