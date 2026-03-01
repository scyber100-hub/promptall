# Plan: search-discovery

## Overview
검색 기능 강화 및 발견성 개선. 현재 MongoDB text index와 `$text` 검색은 구현되어 있으나 Header에 검색 UI가 없고, 유저 검색과 전용 검색 결과 페이지가 없음.

## Current State Analysis
- **이미 구현됨**: MongoDB text index (title/content/tags), `GET /api/prompts?q=...`, PromptFilters 검색 입력, `/prompts` 페이지 검색
- **미구현**: Header 검색 바 UI, 유저 검색 API, 전용 검색 결과 페이지, PromptFilters i18n 미적용(한국어 하드코딩)

## Problem Statement
- Header에 검색 입력창이 없어 전역 검색 접근성 저하
- 프롬프트 검색만 가능, 유저/작성자 검색 불가
- 검색 시 /prompts 페이지로 이동 → 프롬프트/유저 통합 검색 결과 페이지 없음
- PromptFilters "유형", "카테고리", "AI 도구" 레이블이 한국어 하드코딩

## Goals
- 모든 페이지에서 Header 검색 바를 통해 검색 가능
- 전용 검색 결과 페이지 (`/search?q=...`) — 프롬프트 + 유저 탭
- 유저 검색 API (이름/사용자명 검색)
- PromptFilters 완전 i18n 적용

## Non-Goals
- 검색 자동완성/suggestions (별도 사이클)
- Elasticsearch/Atlas Search 고급 검색 (MongoDB text로 충분)
- 검색 키워드 하이라이팅

## Functional Requirements

### FR-01: Header 검색 바
- Header에 검색 입력창 추가 (데스크탑: 인라인, 모바일: 아이콘 클릭 시 확장)
- Enter 또는 검색 버튼 클릭 → `/${locale}/search?q={keyword}` 이동
- 현재 URL에 `q` 파라미터 있으면 pre-fill

### FR-02: 전용 검색 결과 페이지 (`/[locale]/search`)
- `?q=` 쿼리 파라미터 기반
- 탭: Prompts | Users
- Prompts 탭: 기존 `/api/prompts?q=` 활용
- Users 탭: 새 유저 검색 API 활용
- 검색어 없으면 안내 메시지

### FR-03: 유저 검색 API
- `GET /api/search/users?q={keyword}&page=&limit=`
- name 또는 username에서 regex 검색 (대소문자 무시)
- 응답: `{ users: [...], total, pages }`

### FR-04: PromptFilters i18n 수정
- "유형" → `t('prompts.filter_type')` (또는 `generation_types` 네임스페이스)
- "카테고리" → `t('prompts.filter_category')`
- "AI 도구" → `t('prompts.filter_ai_tool')` (또는 기존 `ai_tools` 네임스페이스)
- 6개 locale 파일에 관련 키 추가

## Tech Stack
- Next.js 16 App Router
- MongoDB regex 검색 (유저), text index (프롬프트)
- next-intl v4
- Tailwind CSS v4

## Affected Files
- MOD: `components/layout/Header.tsx` (검색 바 추가)
- NEW: `app/[locale]/search/page.tsx` (검색 결과 페이지)
- NEW: `app/api/search/users/route.ts` (유저 검색 API)
- MOD: `components/prompts/PromptFilters.tsx` (i18n 적용)
- MOD: `messages/*.json` x6 (search, filter 키 추가)

## Success Criteria
- Header에서 검색어 입력 → `/search?q=...` 이동
- Prompts 탭: 제목/내용/태그 검색 결과 표시
- Users 탭: 이름/사용자명 일치 유저 카드 표시
- PromptFilters 6개 언어 모두 정상 표시

## Priority
High — 사용자 콘텐츠 발견성 핵심 기능

## Estimated Scope
Medium (6~8 files)
