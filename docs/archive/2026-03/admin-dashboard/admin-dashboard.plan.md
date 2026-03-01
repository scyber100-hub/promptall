# Plan: admin-dashboard

## Overview
어드민 대시보드 강화. 핵심 CRUD(프롬프트/유저 상태 변경, 알림)는 이미 구현되어 있음.
운영에 실제로 필요한 통계, 신고 관리, 검색/필터, Header 어드민 진입 링크를 추가한다.

## Current State Analysis

### 이미 구현됨 ✅
- `app/[locale]/admin/page.tsx` — 어드민 전용 페이지 (role 체크, redirect)
- `components/admin/AdminConsole.tsx` — Prompts / Users / Notifications 탭 UI
- `GET /api/admin/prompts` — 페이지네이션 + status 필터 (API만)
- `PATCH /api/admin/prompts/[id]` — 상태 변경 (active/hidden/deleted)
- `DELETE /api/admin/prompts/[id]` — 영구 삭제
- `GET /api/admin/users` — 페이지네이션 (API만)
- `PATCH /api/admin/users/[id]` — 정지/복구, admin 권한 부여/해제
- `GET/PATCH /api/admin/notifications` — 어드민 알림 읽기/처리
- `User.role: 'user' | 'admin'` — 역할 필드 존재
- `Prompt.reportCount` — 신고 수 필드 존재

### 미구현 (이번 사이클 대상) ❌
- **통계 패널** — 전체 유저/프롬프트 수, 오늘 가입자, 신고 대기 수 없음
- **신고된 프롬프트 전용 뷰** — reportCount 표시는 있으나 필터/정렬 없음
- **테이블 내 검색 UI** — API는 지원하나 AdminConsole에 검색창 없음
- **Header 어드민 진입 링크** — 어드민은 직접 URL 입력해야만 접근 가능

## Problem Statement
- 운영자가 신고된 콘텐츠를 빠르게 식별하고 처리할 수 없음
- 사이트 현황(유저 수, 프롬프트 수 등)을 한눈에 볼 수 없음
- 특정 유저/프롬프트를 찾으려면 스크롤해야 함 (50개 중 눈으로 찾기)
- 어드민 역할을 가진 유저도 Header에 어드민 링크가 없어 UX 불편

## Goals
1. 어드민 대시보드 상단에 통계 카드 패널 추가
2. 신고된 프롬프트 탭/필터 추가 (reportCount > 0, 신고 수 내림차순)
3. Prompts/Users 탭에 실시간 검색 필터 추가
4. Header 유저 드롭다운에 어드민 링크 조건부 표시

## Non-Goals
- 어드민 전용 통계 차트/그래프 (Recharts 등 별도 라이브러리)
- 어드민 활동 로그/감사 추적
- 어드민 페이지네이션 UI (현재 limit=50으로 충분)
- 이메일 발송 기능

## Functional Requirements

### FR-01: 통계 개요 패널
- 어드민 페이지 상단에 4개 통계 카드:
  - 전체 유저 수 (`User.countDocuments({})`)
  - 전체 프롬프트 수 (`Prompt.countDocuments({ status: 'active' })`)
  - 오늘 가입자 수 (today 00:00 이후 createdAt)
  - 신고 대기 수 (`Prompt.countDocuments({ reportCount: { $gt: 0 }, status: 'active' }}`)
- `GET /api/admin/stats` — 신규 API (admin 전용)
- Server Component에서 직접 fetch 또는 별도 API 호출

### FR-02: 신고된 프롬프트 필터 탭
- AdminConsole Prompts 탭에 상단 필터 버튼:
  - `All` / `Reported (N)` / `Hidden` / `Deleted`
- `Reported` 선택 시: reportCount > 0 + active 상태인 프롬프트만 표시, reportCount 내림차순 정렬
- 기존 클라이언트 상태(prompts array)에서 필터링 (API 재호출 없이)

### FR-03: 테이블 검색 필터
- Prompts 탭: 제목 또는 작성자 username으로 검색 (클라이언트 사이드 필터)
- Users 탭: 이름, username, 이메일로 검색 (클라이언트 사이드 필터)
- `<input>` → 실시간 필터링 (useState + Array.filter)
- 검색어 초기화 버튼(X)

### FR-04: Header 어드민 링크
- `components/layout/Header.tsx` 유저 드롭다운 메뉴
- `session.user.role === 'admin'`일 때만 "Admin Console" 항목 표시
- `/${locale}/admin`으로 이동

## Tech Stack
- Next.js 16 App Router (Server + Client Component 혼용)
- MongoDB/Mongoose
- next-intl (어드민 페이지는 영문 고정 — 관리자 전용)
- Tailwind CSS v4

## Affected Files

| 파일 | 액션 | 설명 |
|------|------|------|
| `app/api/admin/stats/route.ts` | NEW | 통계 API (GET) |
| `app/[locale]/admin/page.tsx` | MOD | 통계 패널 추가 (stats fetch) |
| `components/admin/AdminConsole.tsx` | MOD | 필터 탭 + 검색 + 통계 카드 UI |
| `components/layout/Header.tsx` | MOD | 어드민 링크 조건부 표시 |

**총 4개 파일** (NEW 1 + MOD 3)

## Success Criteria
- 어드민 페이지 상단에 4개 통계 카드 표시
- "Reported" 필터 클릭 시 신고된 프롬프트만 표시, reportCount 내림차순
- 검색창에 타이핑하면 테이블이 실시간으로 필터링됨
- 어드민 계정 Header 드롭다운에 "Admin Console" 링크 표시
- 일반 유저는 어드민 링크 표시되지 않음

## Priority
High — 실제 운영에 즉시 필요한 기능

## Estimated Scope
Small (4 files, 기존 구조 확장)
