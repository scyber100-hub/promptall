# Plan: community-features (PDCA Cycle #3)

## Feature Overview
**Project**: PromptAll
**Cycle**: #3 - Community Features
**Goal**: Strengthen social connections and community discovery

## Background
Cycle #1 delivered core platform. Cycle #2 fixed i18n and UX polish.
Cycle #3 focuses on community social features identified in the roadmap.

## Current State Analysis

### Already Implemented (usable base)
- Follow/Unfollow: `Follow` model, `/api/users/[username]/follow`, `FollowButton` component ✅
- Following Feed: `FollowingFeed` component, `/api/feed` API ✅
- Profile page with FollowButton ✅

### Issues / Missing

#### 1. FollowingFeed hardcoded Korean (i18n regression)
`/components/home/FollowingFeed.tsx`:
- `"팔로우 피드"` — no i18n
- `"팔로우한 사용자가 없습니다."` — no i18n
- `"프롬프트 탐색 →"` — no i18n

#### 2. No follower/following counts
- `User` model has no `followerCount` / `followingCount` fields
- Profile page shows no social stats

#### 3. No Followers/Following list pages
- No way to see who a user follows or who follows them

#### 4. No Collections feature
- Users can only bookmark prompts; no way to organize them into named lists
- No `Collection` model exists

## Requirements

### FR-01: Fix FollowingFeed i18n (P0 Critical)
- Replace hardcoded Korean in `FollowingFeed.tsx` with i18n keys
- Add keys to all 6 locale files under `feed` namespace

### FR-02: Follower/Following Counts on Profile (P1 High)
- Add `followerCount` / `followingCount` to `User` model
- Increment/decrement counts when follow/unfollow API is called
- Display counts on profile page header

### FR-03: Followers / Following List Pages (P1 High)
- New page: `/[locale]/profile/[username]/followers` — list of followers
- New page: `/[locale]/profile/[username]/following` — list of followings
- API: `GET /api/users/[username]/followers` and `GET /api/users/[username]/following`
- Each user card shows name, username, avatar, bio snippet, FollowButton

### FR-04: Collections (Curated Prompt Lists) (P2 Medium)
- New `Collection` model: `{ name, description, owner, prompts[], isPublic, slug }`
- Pages:
  - `/[locale]/collections/[slug]` — public collection view
  - `/[locale]/profile/[username]/collections` — user's collections
  - `/[locale]/collections/new` — create collection (auth required)
- API endpoints:
  - `POST /api/collections` — create
  - `GET /api/collections/[slug]` — get collection
  - `PUT /api/collections/[slug]` — update (owner only)
  - `POST /api/collections/[slug]/prompts` — add/remove prompt
  - `GET /api/users/[username]/collections` — user's public collections
- "Add to Collection" button on prompt detail page

## Tech Stack
- No new dependencies required
- MongoDB: new `Collection` model + indexes
- Next.js App Router pages
- Existing auth (NextAuth) + existing FollowButton pattern

## Pages / Files

### New files
- `/app/[locale]/profile/[username]/followers/page.tsx`
- `/app/[locale]/profile/[username]/following/page.tsx`
- `/app/[locale]/profile/[username]/collections/page.tsx`
- `/app/[locale]/collections/new/page.tsx`
- `/app/[locale]/collections/[slug]/page.tsx`
- `/app/api/users/[username]/followers/route.ts`
- `/app/api/users/[username]/following/route.ts`
- `/app/api/collections/route.ts`
- `/app/api/collections/[slug]/route.ts`
- `/app/api/collections/[slug]/prompts/route.ts`
- `/app/api/users/[username]/collections/route.ts`
- `/models/Collection.ts`
- `/components/collections/AddToCollectionButton.tsx`
- `/components/collections/CollectionCard.tsx`
- `/components/social/UserCard.tsx`

### Modified files
- `/components/home/FollowingFeed.tsx` — i18n fix
- `/models/User.ts` — add followerCount, followingCount
- `/app/api/users/[username]/follow/route.ts` — update counts
- `/app/[locale]/profile/[username]/page.tsx` — show counts + collections tab
- All 6 `/messages/*.json` — add `feed` namespace keys

## Priority
| FR | Priority | Effort | Impact |
|----|----------|--------|--------|
| FR-01 (i18n fix) | P0 Critical | XS | High |
| FR-02 (follow counts) | P1 High | S | High |
| FR-03 (followers/following pages) | P1 High | M | High |
| FR-04 (collections) | P2 Medium | L | High |

## Success Criteria
- FollowingFeed displays correctly in all 6 languages
- Profile page shows follower/following counts
- Users can view followers/following lists
- Users can create, view, and manage collections
- "Add to Collection" available on prompt detail page
