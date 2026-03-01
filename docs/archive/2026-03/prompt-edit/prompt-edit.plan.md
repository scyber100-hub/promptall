# Plan: prompt-edit

## Overview
프롬프트 편집 기능 추가. 편집 API(`PUT /api/prompts/[id]`)는 이미 완전히 구현되어 있음.
편집 페이지와 상세 페이지의 편집 버튼만 추가하면 완성된다.

## Current State Analysis

### 이미 구현됨 ✅
- `PUT /api/prompts/[id]` — 편집 API (작성자/admin 권한 체크, 전체 필드 업데이트)
  - title, content, description, aiTool, generationType, category, tags, resultText, resultImages, resultLink
  - `prompt.author.toString() !== userId && role !== 'admin'` → 403
- `app/[locale]/prompts/new/page.tsx` — 프롬프트 생성 폼 (전체 필드, 이미지 업로드, 유효성 검사)
- `DELETE /api/prompts/[id]` — 소프트 삭제 (status: 'deleted')

### 미구현 (이번 사이클 대상) ❌
- **편집 페이지** — `app/[locale]/prompts/[id]/edit/page.tsx` 없음
- **편집 버튼** — 상세 페이지에서 편집 페이지로 이동하는 버튼 없음 (이전 사이클 FR-04 보류)

## Problem Statement
- 작성자가 오탈자를 수정하거나 내용을 개선할 방법이 없음
- URL을 직접 입력해도 edit 라우트 자체가 없어 404 발생
- 편집 API는 완성되어 있으나 UI가 없어 사용 불가

## Goals
1. 기존 생성 폼을 재활용하는 편집 페이지 구현
2. 프롬프트 상세 페이지에 편집 버튼 추가 (작성자 본인만 표시)

## Non-Goals
- 편집 이력/버전 관리
- 편집 잠금 (동시 수정 방지)
- 이미지 개별 삭제 API (업로드는 기존 `/api/upload` 재사용)

## Functional Requirements

### FR-01: 편집 페이지
- **경로**: `app/[locale]/prompts/[id]/edit/page.tsx`
- **타입**: Client Component (`'use client'`)
- **초기화**: 페이지 마운트 시 `GET /api/prompts/[id]` 또는 DB 직접 조회로 기존 데이터 로드
  - 접근 제어: 비로그인 → `/auth/signin` 리다이렉트
  - 타인 프롬프트 → `/prompts/[id]`로 리다이렉트 (403 처리)
- **폼**: 기존 `/prompts/new` 폼과 동일한 필드
  - 기존 데이터로 `form` state 초기화
  - 기존 `resultImages`도 `images` state로 초기화
- **제출**: `PUT /api/prompts/[id]` 호출
- **성공 시**: `router.push(`/${locale}/prompts/${slug}`)` (slug가 변경될 수 있으므로 응답에서 추출)
- **유효성 검사**: 생성 폼과 동일 (title 5-80, description 10-160, content min 50)

### FR-02: 편집 버튼 (상세 페이지)
- **파일**: `app/[locale]/prompts/[id]/page.tsx` (Server Component)
- `getServerSession(authOptions)`으로 현재 유저 확인
- `session.user.id === p.author` 일 때만 편집 버튼 표시
- 위치: 액션 버튼 row (`ShareButtons` 다음)
- UI: `<Link href={`/${locale}/prompts/${p._id}/edit`}>` + Pencil 아이콘

## Tech Stack
- Next.js 16 App Router
- MongoDB/Mongoose (`GET /api/prompts/[id]` 재사용)
- NextAuth v4 (`getServerSession` in page.tsx, `useSession` in edit page)
- Tailwind CSS v4

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `app/[locale]/prompts/[id]/edit/page.tsx` | NEW | 편집 폼 페이지 (기존 new 폼 재활용) |
| `app/[locale]/prompts/[id]/page.tsx` | MOD | 편집 버튼 추가 (getServerSession + Pencil 아이콘) |

**총 2개 파일** (NEW 1 + MOD 1)

## Success Criteria
- `/prompts/[id]/edit` 접속 시 기존 데이터가 폼에 채워진 상태로 표시
- 수정 후 저장 시 상세 페이지로 이동, 변경 내용 반영
- 타인 프롬프트 edit URL 직접 접속 시 상세 페이지로 리다이렉트
- 상세 페이지에서 작성자 본인에게만 편집 버튼 표시
- 일반 유저에게는 편집 버튼 미표시

## Priority
High — 작성자 UX의 기본 기능, API는 이미 완성됨

## Estimated Scope
XSmall (NEW 1 + MOD 1, API 재사용, 폼 로직 재활용)
