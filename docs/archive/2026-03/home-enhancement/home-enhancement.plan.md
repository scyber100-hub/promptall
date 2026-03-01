# Plan: Home 페이지 강화

## Feature Overview
Home 페이지의 3가지 구체적인 이슈를 수정하여 품질과 정확성을 개선합니다.

## Problem Analysis

### BUG-01: FollowingFeed "Following" 배지 하드코딩
- **파일**: `components/home/FollowingFeed.tsx` L42
- **현상**: `<span>"Following"</span>` — 영어 하드코딩, i18n 미적용
- **영향**: 다국어(KO/JA/ZH/ES/FR) 사용자에게 항상 영어로 표시

### FR-01: Popular 섹션이 "Trending" 라벨 오용
- **파일**: `app/[locale]/page.tsx` L43 (쿼리), L222 (배지)
- **현상**: `sort({ likeCount: -1 })` 정렬인데 `trending_badge: "Trending"` 표시
- **실제 trendingScore 공식**: `likeCount * 2 + viewCount * 0.2 + bookmarkCount * 1`
- **영향**: 실제 트렌딩 공식 있음에도 likeCount 단순 정렬 사용

### FR-02: Hero 통계에 유저 수 없음
- **파일**: `app/[locale]/page.tsx` L129-149
- **현상**: stats = 프롬프트 수 + AI툴수(8 고정) + 언어수(6 고정) + 무료(텍스트)
- **개선**: `User.countDocuments()` 추가하여 실제 커뮤니티 규모 표시

## Scope

| # | 구분 | 내용 | 파일 |
|---|------|------|------|
| BUG-01 | 버그 | FollowingFeed "Following" i18n 적용 | `components/home/FollowingFeed.tsx`, `messages/*.json` (6개) |
| FR-01 | 기능 | Popular 섹션 trendingScore 정렬로 교체 | `app/[locale]/page.tsx` |
| FR-02 | 기능 | Hero stats에 유저 수 추가 | `app/[locale]/page.tsx`, `messages/*.json` (6개) |

## Implementation Plan

1. `messages/*.json` (6개 언어) — `feed.following_badge`, `home.stats_members`, `home.stats_community` 키 추가
2. `components/home/FollowingFeed.tsx` — `t('following_badge')` 사용
3. `app/[locale]/page.tsx` — `getFeaturedPrompts()`에서:
   - `popular` 쿼리를 `sort({ trendingScore: -1 })` 로 교체
   - `User.countDocuments()` 추가 → `memberCount` 반환
   - Hero stats에 member count stat 추가

## Acceptance Criteria
- [ ] FollowingFeed 배지가 6개 언어로 번역됨
- [ ] Popular 섹션이 trendingScore 기준으로 정렬됨
- [ ] Hero stats에 실제 유저 수 표시됨
