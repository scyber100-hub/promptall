# Design: promptall

## Architecture

### Directory Structure
```
app/
  [locale]/
    page.tsx              — Home page
    layout.tsx            — Locale layout (Header + Footer)
    prompts/
      page.tsx            — Browse prompts
      new/page.tsx        — Create prompt
      [id]/page.tsx       — Prompt detail
    explore/page.tsx      — Explore by tool/category
    bookmarks/page.tsx    — User bookmarks
    profile/[username]/page.tsx — User profile
    auth/
      signin/page.tsx
      signup/page.tsx
  api/
    auth/[...nextauth]/route.ts
    prompts/
      route.ts            — GET (list), POST (create)
      [id]/
        route.ts          — GET, PUT, DELETE
        like/route.ts     — POST (toggle like)
        bookmark/route.ts — POST (toggle bookmark)
        copy/route.ts     — POST (increment copy count)
        comments/route.ts — GET (list comments)
    comments/
      route.ts            — POST (create comment)
      [id]/route.ts       — DELETE
    upload/route.ts       — POST (image upload)
    users/route.ts        — GET (user info)
  layout.tsx              — Root layout (AdSense)

components/
  layout/
    Header.tsx
    Footer.tsx
  prompts/
    PromptCard.tsx
    PromptFilters.tsx
    CopyPromptButton.tsx
  social/
    LikeButton.tsx
    BookmarkButton.tsx
    CommentSection.tsx
  ads/
    AdBanner.tsx
  analytics/
    GoogleAnalytics.tsx
  providers/
    SessionProvider.tsx

models/
  User.ts
  Prompt.ts
  Like.ts
  Bookmark.ts
  Comment.ts

lib/
  mongodb.ts
  auth.ts
  utils.ts

messages/
  en.json, ko.json, ja.json, zh.json, es.json, fr.json
```

## Data Models

### User
- name, email, password (hashed), username, image, bio
- role: 'user' | 'admin'
- promptCount, likeCount

### Prompt
- title, content, description, slug
- aiTool, category, tags[]
- author (ref: User), authorName, authorUsername, authorImage
- status: 'active' | 'deleted'
- likeCount, commentCount, viewCount, copyCount, bookmarkCount, trendingScore
- resultText, resultImages[]

### Like
- userId, targetId, targetType: 'prompt' | 'comment'

### Bookmark
- userId, promptId

### Comment
- promptId, author (ref: User), authorName, authorUsername, authorImage
- content, parentId (for replies)
- status: 'active' | 'deleted'
- replyCount

## API Design

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/prompts | No | List prompts (filter, sort, paginate) |
| POST | /api/prompts | Yes | Create prompt |
| GET | /api/prompts/:id | No | Get prompt detail |
| PUT | /api/prompts/:id | Yes (owner/admin) | Update prompt |
| DELETE | /api/prompts/:id | Yes (owner/admin) | Soft delete |
| POST | /api/prompts/:id/like | Yes | Toggle like |
| POST | /api/prompts/:id/bookmark | Yes | Toggle bookmark |
| POST | /api/prompts/:id/copy | No | Increment copy count |
| GET | /api/prompts/:id/comments | No | List comments |
| POST | /api/comments | Yes | Create comment/reply |
| DELETE | /api/comments/:id | Yes (owner/admin) | Delete comment |
| POST | /api/upload | Yes | Upload image to Cloudinary |
| GET | /api/users | Yes | Get current user info |

## Routing
- Locale routing via proxy.ts (Next.js 16 equivalent of middleware.ts)
- Supported locales: en, ko, ja, zh, es, fr
- Default locale: en

## Auth Flow
- Email/Password: bcrypt hashing, JWT session
- Google OAuth: next-auth provider
- Protected pages: /prompts/new, /bookmarks (redirect to signin)

## i18n
- next-intl v4
- Server components: getTranslations()
- Client components: useTranslations()
- 6 language files in /messages/

## AdSense / Analytics
- AdSense script in root layout.tsx (skip if placeholder ID)
- GA4 tracking via GoogleAnalytics component
- AdBanner component with placeholder check
