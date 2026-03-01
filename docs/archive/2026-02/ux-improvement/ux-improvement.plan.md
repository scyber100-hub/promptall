# Plan: ux-improvement (PDCA Cycle #2)

## Feature Overview
**Project**: PromptAll
**Cycle**: #2 - UX Improvement
**Goal**: Fix i18n gaps, improve trending algorithm, enhance discoverability

## Background
PDCA Cycle #1 delivered all 10 core features with 96% match rate.
Cycle #2 focuses on quality polish and UX improvements identified post-completion.

## Issues Identified

### 1. Hard-coded Korean text in Home page (Critical)
`/app/[locale]/page.tsx` contains Korean strings not using i18n:
- `탐색하기` (Browse section title)
- `전체 보기` (View all links — 2 occurrences)
- `AI 도구` (Section divider label)
- GENERATION_TYPES array labels: `텍스트`, `이미지`, `동영상`, `개발`

These break the 6-language UX for EN/JA/ZH/ES/FR users.

### 2. Trending Algorithm Missing Time Decay
`/app/api/cron/trending/route.ts` calculates:
```
score = wLikes×3 + wBookmarks×2 + viewCount×0.05 + copyCount×0.5
```
No time decay → older prompts with accumulated stats dominate trending permanently.

### 3. View Count Not Displayed
`viewCount` exists in Prompt model and is incremented on detail page load,
but never shown in PromptCard or prompt detail stats.

## Requirements

### FR-01: Fix Home Page i18n
- Replace all hard-coded Korean strings with `t()` calls
- Add missing i18n keys to all 6 locale files (en, ko, ja, zh, es, fr)
- Affected: `/app/[locale]/page.tsx`, all 6 message files

### FR-02: Improve Trending Score with Time Decay
- Add `ageInDays` decay factor to trending formula
- New formula: `score = (wLikes×3 + wBookmarks×2 + copyCount×0.5) × decay`
- `decay = 1 / (1 + ageInDays × 0.1)` — 10% decay per day
- View count weight reduced (passive metric, less meaningful)
- Affected: `/app/api/cron/trending/route.ts`

### FR-03: Show View Count in Prompt Stats
- Add view count display to PromptCard footer
- Show Eye icon + viewCount in prompt detail page stats
- Affected: `/components/prompts/PromptCard.tsx`, `/app/[locale]/prompts/[id]/page.tsx`

### FR-04: Fix Pagination for Large Result Sets
- Current: shows only pages 1-7 even when more pages exist
- Fix: show first/last page with ellipsis when totalPages > 7
- Affected: `/app/[locale]/prompts/page.tsx`

## Tech Stack
- No new dependencies required
- Changes: TypeScript, i18n JSON files, existing components

## Pages / Files Affected
- `/app/[locale]/page.tsx` — home page i18n fix
- `/app/[locale]/prompts/page.tsx` — pagination fix
- `/app/[locale]/prompts/[id]/page.tsx` — viewCount display
- `/app/api/cron/trending/route.ts` — trending algorithm
- `/components/prompts/PromptCard.tsx` — viewCount in card
- `/messages/en.json`, `ko.json`, `ja.json`, `zh.json`, `es.json`, `fr.json` — i18n keys

## Priority
| FR | Priority | Effort | Impact |
|----|----------|--------|--------|
| FR-01 (i18n fix) | P0 Critical | Small | High |
| FR-02 (trending) | P1 High | Small | Medium |
| FR-03 (viewCount) | P2 Medium | Small | Low |
| FR-04 (pagination) | P2 Medium | Small | Medium |

## Success Criteria
- All non-English locales render home page without Korean text
- Trending section shows recent popular prompts (not just all-time)
- PromptCard displays view count
- Pagination correctly handles > 7 pages
