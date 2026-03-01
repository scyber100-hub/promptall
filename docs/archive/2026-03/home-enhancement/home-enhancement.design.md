# Design: Home 페이지 강화

## Reference
- Plan: `docs/01-plan/features/home-enhancement.plan.md`

## Requirements

### BUG-01: FollowingFeed i18n 적용

| ID | 요구사항 | 파일 |
|----|---------|------|
| REQ-01 | `messages/en.json` `feed` 네임스페이스에 `following_badge: "Following"` 추가 | `messages/en.json` |
| REQ-02 | `messages/ko.json` `feed` 네임스페이스에 `following_badge: "팔로잉"` 추가 | `messages/ko.json` |
| REQ-03 | `messages/ja.json` `feed` 네임스페이스에 `following_badge: "フォロー中"` 추가 | `messages/ja.json` |
| REQ-04 | `messages/zh.json` `feed` 네임스페이스에 `following_badge: "关注中"` 추가 | `messages/zh.json` |
| REQ-05 | `messages/es.json` `feed` 네임스페이스에 `following_badge: "Siguiendo"` 추가 | `messages/es.json` |
| REQ-06 | `messages/fr.json` `feed` 네임스페이스에 `following_badge: "Abonnements"` 추가 | `messages/fr.json` |
| REQ-07 | `FollowingFeed.tsx` L42 — `"Following"` → `{t('following_badge')}` 교체 | `components/home/FollowingFeed.tsx` |

### FR-01: Popular 섹션 trendingScore 정렬

| ID | 요구사항 | 파일 |
|----|---------|------|
| REQ-08 | `getFeaturedPrompts()` 내 `popular` 쿼리를 `sort({ trendingScore: -1 })` 로 교체 | `app/[locale]/page.tsx` |

### FR-02: Hero stats 유저 수 추가

| ID | 요구사항 | 파일 |
|----|---------|------|
| REQ-09 | `messages/*.json` (6개) `home` 네임스페이스에 `stats_members` 키 추가 (en: "Members") | `messages/*.json` |
| REQ-10 | `getFeaturedPrompts()` 에서 `User.countDocuments()` 추가, `memberCount` 반환 | `app/[locale]/page.tsx` |
| REQ-11 | Hero stats 섹션에 `memberCount` stat 추가 (프롬프트 수 앞에 배치, `memberCount > 0 ? X + : '1K+'`) | `app/[locale]/page.tsx` |
| REQ-12 | `User` 모델 import 추가 | `app/[locale]/page.tsx` |

## i18n Values

| key | en | ko | ja | zh | es | fr |
|-----|----|----|----|----|----|----|
| `feed.following_badge` | Following | 팔로잉 | フォロー中 | 关注中 | Siguiendo | Abonnements |
| `home.stats_members` | Members | 멤버 | メンバー | 成员 | Miembros | Membres |

## Implementation Checklist

### messages/ (6 files)
- [ ] REQ-01~06: `feed.following_badge` 추가 (6개 언어)
- [ ] REQ-09: `home.stats_members` 추가 (6개 언어)

### FollowingFeed.tsx
- [ ] REQ-07: `"Following"` → `{t('following_badge')}`

### app/[locale]/page.tsx
- [ ] REQ-08: `sort({ likeCount: -1 })` → `sort({ trendingScore: -1 })`
- [ ] REQ-10: `User.countDocuments()` 추가
- [ ] REQ-11: Hero stats에 memberCount 표시
- [ ] REQ-12: `import User` 추가

## Total Requirements: 12
