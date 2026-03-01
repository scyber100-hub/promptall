# Plan: Bookmarks 페이지 강화

## Feature Overview
Bookmarks 페이지의 하드코딩된 텍스트를 i18n으로 교체하고, limit 50 고정 문제를 페이지네이션으로 해결합니다.

## Problem Analysis

### BUG-01~04: 하드코딩 텍스트 (i18n 미적용)
- **파일**: `app/[locale]/bookmarks/page.tsx`
- "My Bookmarks" — 페이지 제목 하드코딩
- "No bookmarks yet" — 빈 상태 제목 하드코딩
- "Save prompts you love by clicking the bookmark icon." — 빈 상태 설명 하드코딩
- "Browse Prompts" — CTA 링크 텍스트 하드코딩
- **현상**: `bookmarks` 네임스페이스 자체가 없음 (6개 언어 파일 모두)

### FR-01: limit 50 고정
- **파일**: `app/[locale]/bookmarks/page.tsx` L28-31
- `Bookmark.find({ userId }).limit(50)` — 북마크 50개 초과 시 표시 불가
- `searchParams` prop 없어 URL 기반 페이지네이션 불가
- **개선**: 12개/페이지 + prev/next 페이지네이션

## Scope

| # | 구분 | 내용 | 파일 |
|---|------|------|------|
| BUG-01~04 | 버그 | 4개 텍스트 i18n 교체 | `app/[locale]/bookmarks/page.tsx` |
| i18n | 작업 | `bookmarks` 네임스페이스 생성 | `messages/*.json` (6개) |
| FR-01 | 기능 | URL 기반 페이지네이션 (12개/페이지) | `app/[locale]/bookmarks/page.tsx` |

## Implementation Plan

1. `messages/*.json` (6개 언어) — `bookmarks` 네임스페이스 추가 (title, empty_title, empty_desc, browse, prev, next)
2. `app/[locale]/bookmarks/page.tsx`:
   - `getTranslations('bookmarks')` 추가
   - `searchParams` prop 추가 (`page?: string`)
   - 쿼리: `skip + limit(12) + countDocuments()`
   - 텍스트 4개 → `t()` 교체
   - Prev/Next 페이지네이션 UI 추가

## Acceptance Criteria
- [ ] 6개 언어에서 모든 텍스트가 번역됨
- [ ] 12개/페이지 표시 + prev/next 네비게이션
- [ ] 총 북마크 수가 헤더에 표시됨
