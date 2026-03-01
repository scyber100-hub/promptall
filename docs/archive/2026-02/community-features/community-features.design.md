# Design: community-features (PDCA Cycle #3)

## Overview
**Feature**: Community Features — i18n fix, follow counts, list pages, collections
**Phase**: Design
**Based on**: community-features.plan.md

---

## FR-01: Fix FollowingFeed i18n

### Problem (exact lines in `/components/home/FollowingFeed.tsx`)
```tsx
<h2 className="text-2xl font-bold text-slate-900">팔로우 피드</h2>      // hardcoded
<p className="text-sm">팔로우한 사용자가 없습니다.</p>                    // hardcoded
<Link ...>프롬프트 탐색 →</Link>                                          // hardcoded
```

### Solution

#### New `feed` namespace in all 6 locale files

```json
// en.json
"feed": {
  "title": "Following Feed",
  "empty": "You're not following anyone yet.",
  "browse_link": "Browse Prompts →"
}
```

| Locale | `feed.title` | `feed.empty` | `feed.browse_link` |
|--------|-------------|--------------|-------------------|
| en | `"Following Feed"` | `"You're not following anyone yet."` | `"Browse Prompts →"` |
| ko | `"팔로우 피드"` | `"팔로우한 사용자가 없습니다."` | `"프롬프트 탐색 →"` |
| ja | `"フォローフィード"` | `"フォロー中のユーザーがいません。"` | `"プロンプトを探す →"` |
| zh | `"关注动态"` | `"您还没有关注任何人。"` | `"浏览提示词 →"` |
| es | `"Feed de seguidos"` | `"Aún no sigues a nadie."` | `"Explorar Prompts →"` |
| fr | `"Fil des abonnements"` | `"Vous ne suivez personne encore."` | `"Explorer les Prompts →"` |

#### Update FollowingFeed.tsx
- Add `useTranslations('feed')` (client component uses `useTranslations`)
- Replace 3 hardcoded strings with `t('title')`, `t('empty')`, `t('browse_link')`

### Files Changed
- `/components/home/FollowingFeed.tsx`
- `/messages/en.json`, `ko.json`, `ja.json`, `zh.json`, `es.json`, `fr.json` — add `feed` namespace

---

## FR-02: Follower/Following Counts

### Model Change — `/models/User.ts`

Add two fields to `IUser` interface and `UserSchema`:
```ts
// IUser interface additions:
followerCount: number;
followingCount: number;

// UserSchema field additions:
followerCount: { type: Number, default: 0 },
followingCount: { type: Number, default: 0 },
```

### API Change — `/app/api/users/[username]/follow/route.ts`

POST handler: after creating/deleting Follow document, update both users' counts:
```ts
// On follow (create):
await User.findByIdAndUpdate(target._id, { $inc: { followerCount: 1 } });
await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });

// On unfollow (delete):
await User.findByIdAndUpdate(target._id, { $inc: { followerCount: -1 } });
await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
```

### Profile Page Change — `/app/[locale]/profile/[username]/page.tsx`

Add to the stats row (after `promptCount`):
```tsx
<Link href={`/${locale}/profile/${u.username}/followers`}
  className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
  <Users size={14} />
  {u.followerCount ?? 0} {t('followers')}
</Link>
<Link href={`/${locale}/profile/${u.username}/following`}
  className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
  {u.followingCount ?? 0} {t('following')}
</Link>
```

Add i18n keys to `profile` namespace:
```json
"followers": "followers",
"following": "following",
"followers_title": "Followers",
"following_title": "Following"
```

Also add `viewCount` to prompt serializer in profile page (consistent with other pages):
```ts
viewCount: p.viewCount ?? 0,
```

### Files Changed
- `/models/User.ts`
- `/app/api/users/[username]/follow/route.ts`
- `/app/[locale]/profile/[username]/page.tsx`
- All 6 message files — add 4 keys to `profile` namespace

---

## FR-03: Followers / Following List Pages

### New API Routes

#### `GET /api/users/[username]/followers`
```ts
// Returns paginated list of users who follow [username]
// Query: ?page=1
// Response: { users: IUser[], total, page, pages }

const target = await User.findOne({ username });
const follows = await Follow.find({ following: target._id })
  .sort({ createdAt: -1 })
  .skip((page-1)*limit).limit(limit)
  .populate('follower', 'name username image bio followerCount')
  .lean();
const users = follows.map(f => serialize(f.follower));
```

#### `GET /api/users/[username]/following`
```ts
// Returns paginated list of users [username] follows
// Response: { users: IUser[], total, page, pages }

const follows = await Follow.find({ follower: target._id })
  .sort({ createdAt: -1 })
  .populate('following', 'name username image bio followerCount')
  .lean();
```

**File**: `/app/api/users/[username]/followers/route.ts`
**File**: `/app/api/users/[username]/following/route.ts`

### New UserCard Component — `/components/social/UserCard.tsx`
```tsx
// Reusable user card for lists
interface UserCardProps {
  user: { _id, name, username, image, bio, followerCount }
  locale: string;
}
// Shows: avatar, name, @username, bio snippet, followerCount, FollowButton
```

### New Pages

#### `/app/[locale]/profile/[username]/followers/page.tsx`
- Server component, fetches from `/api/users/[username]/followers`
- Title: `t('followers_title')` + username
- Grid of `UserCard` components
- Back link to profile

#### `/app/[locale]/profile/[username]/following/page.tsx`
- Same pattern as followers page but uses `/following` API

### i18n additions to `profile` namespace
```json
"no_followers": "No followers yet.",
"no_following": "Not following anyone yet."
```

### Files Changed (new)
- `/app/api/users/[username]/followers/route.ts`
- `/app/api/users/[username]/following/route.ts`
- `/app/[locale]/profile/[username]/followers/page.tsx`
- `/app/[locale]/profile/[username]/following/page.tsx`
- `/components/social/UserCard.tsx`

---

## FR-04: Collections

### New Model — `/models/Collection.ts`

```ts
interface ICollection {
  name: string;           // max 60 chars
  description?: string;   // max 160 chars
  owner: ObjectId;        // ref User
  ownerUsername: string;
  ownerName: string;
  prompts: ObjectId[];    // ref Prompt, max 100
  promptCount: number;    // denormalized
  isPublic: boolean;      // default true
  slug: string;           // unique: ownerUsername-name-timestamp36
  createdAt: Date;
  updatedAt: Date;
}

// Indexes:
// { owner: 1, createdAt: -1 }
// { slug: 1 } unique
// { ownerUsername: 1, isPublic: 1 }
```

### New API Routes

#### `POST /api/collections` — Create collection (auth required)
```ts
// Body: { name, description, isPublic }
// Creates collection with slug = generateSlug(name)
// Returns: { collection }
```

#### `GET /api/collections/[slug]` — Get collection
```ts
// Returns collection + populated prompts (limit 20, paginated)
// Public only (or owner if private)
```

#### `PUT /api/collections/[slug]` — Update (owner only)
```ts
// Body: { name, description, isPublic }
```

#### `POST /api/collections/[slug]/prompts` — Add/remove prompt (owner only)
```ts
// Body: { promptId, action: 'add' | 'remove' }
// Max 100 prompts per collection
// Updates promptCount
```

#### `GET /api/users/[username]/collections` — User's public collections
```ts
// Returns paginated list of isPublic collections for username
```

**Files**:
- `/app/api/collections/route.ts`
- `/app/api/collections/[slug]/route.ts`
- `/app/api/collections/[slug]/prompts/route.ts`
- `/app/api/users/[username]/collections/route.ts`

### New Components

#### `/components/collections/CollectionCard.tsx`
```tsx
// Shows: name, description, promptCount, owner, isPublic badge
// Links to /collections/[slug]
```

#### `/components/collections/AddToCollectionButton.tsx`
```tsx
'use client'
// Shown on prompt detail page (auth required)
// Fetches user's collections → dropdown to select
// Calls POST /api/collections/[slug]/prompts
// Shows checkmark if prompt already in collection
// "+ New Collection" option in dropdown
```

### New Pages

#### `/app/[locale]/collections/[slug]/page.tsx`
- Public collection view
- Shows: collection name, description, owner info, prompt grid
- Edit button if owner

#### `/app/[locale]/collections/new/page.tsx`
- Create collection form (auth required, client component)
- Fields: name (required), description (optional), isPublic toggle

#### `/app/[locale]/profile/[username]/collections/page.tsx`
- Lists user's public collections (all collections if own profile)
- Grid of `CollectionCard` components

### Profile Page Tab
Add "Collections" tab to profile page (alongside Prompts/Liked/Bookmarks):
```tsx
<Link href={`/${locale}/profile/${u.username}/collections`}>
  {t('collections_tab')}
</Link>
```

### i18n additions (new `collections` namespace)
```json
"collections": {
  "title": "Collections",
  "new_title": "Create Collection",
  "name_label": "Collection Name",
  "name_placeholder": "My Favorite Prompts",
  "description_label": "Description (Optional)",
  "public_label": "Public",
  "create_btn": "Create Collection",
  "add_to": "Add to Collection",
  "added": "Added",
  "remove": "Remove",
  "no_collections": "No collections yet.",
  "prompts_count": "{count} prompts",
  "create_new": "+ New Collection",
  "empty": "This collection is empty."
}
```

Also add `"collections_tab": "Collections"` to `profile` namespace.

### Files Changed (new)
- `/models/Collection.ts`
- `/app/api/collections/route.ts`
- `/app/api/collections/[slug]/route.ts`
- `/app/api/collections/[slug]/prompts/route.ts`
- `/app/api/users/[username]/collections/route.ts`
- `/app/[locale]/collections/new/page.tsx`
- `/app/[locale]/collections/[slug]/page.tsx`
- `/app/[locale]/profile/[username]/collections/page.tsx`
- `/components/collections/CollectionCard.tsx`
- `/components/collections/AddToCollectionButton.tsx`

### Files Modified
- `/app/[locale]/prompts/[id]/page.tsx` — add `AddToCollectionButton`
- `/app/[locale]/profile/[username]/page.tsx` — add Collections tab link
- All 6 message files — add `collections` namespace + `profile.collections_tab`

---

## Implementation Order

1. **FR-01** — FollowingFeed i18n (smallest, fastest win)
2. **FR-02** — User model + follow count API + profile display
3. **FR-03** — Followers/Following APIs + UserCard + pages
4. **FR-04** — Collection model + APIs + components + pages

---

## Summary of File Changes

| File | Change | FR |
|------|--------|----|
| `/components/home/FollowingFeed.tsx` | i18n fix | FR-01 |
| `/models/User.ts` | Add followerCount, followingCount | FR-02 |
| `/app/api/users/[username]/follow/route.ts` | Update counts | FR-02 |
| `/app/[locale]/profile/[username]/page.tsx` | Counts + Collections tab | FR-02, FR-04 |
| `/app/api/users/[username]/followers/route.ts` | New API | FR-03 |
| `/app/api/users/[username]/following/route.ts` | New API | FR-03 |
| `/app/[locale]/profile/[username]/followers/page.tsx` | New page | FR-03 |
| `/app/[locale]/profile/[username]/following/page.tsx` | New page | FR-03 |
| `/components/social/UserCard.tsx` | New component | FR-03 |
| `/models/Collection.ts` | New model | FR-04 |
| `/app/api/collections/route.ts` | New API | FR-04 |
| `/app/api/collections/[slug]/route.ts` | New API | FR-04 |
| `/app/api/collections/[slug]/prompts/route.ts` | New API | FR-04 |
| `/app/api/users/[username]/collections/route.ts` | New API | FR-04 |
| `/app/[locale]/collections/new/page.tsx` | New page | FR-04 |
| `/app/[locale]/collections/[slug]/page.tsx` | New page | FR-04 |
| `/app/[locale]/profile/[username]/collections/page.tsx` | New page | FR-04 |
| `/components/collections/CollectionCard.tsx` | New component | FR-04 |
| `/components/collections/AddToCollectionButton.tsx` | New component | FR-04 |
| `/app/[locale]/prompts/[id]/page.tsx` | Add AddToCollectionButton | FR-04 |
| All 6 `/messages/*.json` | feed + profile + collections keys | FR-01,02,03,04 |

**Total new files**: 15
**Total modified files**: 8
**New dependencies**: None
