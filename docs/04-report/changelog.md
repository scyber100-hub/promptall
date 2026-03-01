# PromptAll Changelog

## [1.4.4] - 2026-03-01

### Added
- i18n `bookmarks` namespace with 6 translation keys across all 6 languages (EN, KO, JA, ZH, ES, FR)
- URL-based pagination for bookmarks page with prev/next navigation
- Page indicator showing current page position
- Input validation guard preventing negative page numbers

### Changed
- Bookmarks page now displays 12 items per page (increased from fixed 50)
- Hardcoded text replaced with i18n translations for multi-language support
- Database queries optimized with Promise.all parallel execution
- Mongoose queries now use .lean() for improved performance

### Fixed
- BUG-01: "My Bookmarks" page title not internationalized (added i18n)
- BUG-02: Empty state title not internationalized (added i18n)
- BUG-03: Empty state description not internationalized (added i18n)
- BUG-04: "Browse Prompts" CTA text not internationalized (added i18n)
- FR-01: Fixed 50-bookmark limit preventing access to additional bookmarks (added pagination)

### Quality Metrics
- **Design Match Rate**: 100% (16/16 PASS)
- **i18n Coverage**: 100% (36/36 keys verified)
- **Pagination Logic**: 100% (6/6 requirements)
- **Convention Compliance**: 95% (import order style)
- **Iterations Required**: 0

### Technical Details
- 1 Server Component refactored (bookmarks/page.tsx)
- 6 i18n message files updated (messages/*.json)
- 7 total files modified
- ~150 lines of code added/modified
- Full TypeScript compliance, no errors

### PDCA Cycle
- **Cycle**: Bookmarks Enhancement
- **Duration**: 1 cycle (Plan → Design → Do → Check → Report)
- **Status**: Complete ✅
- **Design Alignment**: 100% (all 16 requirements verified)

### Files Created
- `docs/01-plan/features/bookmarks-enhancement.plan.md` - Feature planning
- `docs/02-design/features/bookmarks-enhancement.design.md` - Technical design
- `docs/03-analysis/bookmarks-enhancement.analysis.md` - Gap analysis
- `docs/04-report/features/bookmarks-enhancement.report.md` - Completion report

### Files Modified
- `messages/en.json` - Added bookmarks namespace
- `messages/ko.json` - Added bookmarks namespace
- `messages/ja.json` - Added bookmarks namespace
- `messages/zh.json` - Added bookmarks namespace
- `messages/es.json` - Added bookmarks namespace
- `messages/fr.json` - Added bookmarks namespace
- `app/[locale]/bookmarks/page.tsx` - Full pagination + i18n integration

---

## [1.4.3] - 2026-03-01

### Added
- CollectionManager Client Component: Owner-exclusive edit/delete UI for collection metadata
- CollectionPromptGrid Client Component: Interactive grid with individual prompt removal capability
- isOwner session-based access control for collection management features

### Changed
- collections/[slug]/page.tsx now includes getServerSession() unconditional call
- prompts grid replaced with interactive CollectionPromptGrid component
- Collection detail page now supports owner edit/delete operations

### Fixed
- FR-01: Collection edit and delete UI missing from detail page (added CollectionManager)
- FR-02: Prompt removal UI missing from collection detail (added CollectionPromptGrid with X button overlay)
- Owner identification logic now properly calculated from session and collection ownership

### Quality Metrics
- **Design Match Rate**: 100% (32/32 PASS)
- **Feature Completion**: 2/2 FRs (100%)
- **Iterations Required**: 0
- **TypeScript Errors**: 0
- **Code Quality**: No issues found

### Technical Details
- 2 new Client Components created (CollectionManager, CollectionPromptGrid)
- 1 Server Component modified (collections/[slug]/page.tsx)
- 179 lines of code added (focused, minimal changes)
- Explicit Prompt interface with 12 typed fields (type safety improvement)
- Full TypeScript compliance, no errors

### PDCA Cycle
- **Cycle**: Collections UI Completion
- **Duration**: 1 cycle (Plan → Design → Do → Check → Report)
- **Status**: Complete ✅
- **Design Alignment**: 100% (all 32 requirements verified)

### Files Created
- `components/collections/CollectionManager.tsx` (109 lines) - Edit/delete functionality
- `components/collections/CollectionPromptGrid.tsx` (70 lines) - Prompt grid with removal

### Files Modified
- `app/[locale]/collections/[slug]/page.tsx` (+17 net lines) - Component integration

---

## [1.4.2] - 2026-03-01

### Added
- Avatar display in comment/reply lists with Image component
- Reply delete functionality with author-only permission checks
- Comment system serialization following MongoDB convention

### Changed
- CommentSection component now renders avatars for all comments and replies
- API serialization standardized across GET/POST comment endpoints
- Reply headers restructured to include delete button

### Fixed
- BUG-01: Avatar images not displaying in comment lists (data existed but not rendered)
- BUG-02: Reply authors unable to delete their own replies (UI and handler missing)
- BUG-03: API responses not following MongoDB serialization convention (._id, .createdAt)

### Quality Metrics
- **Design Match Rate**: 100% (18/18 PASS)
- **Feature Completion**: 3/3 bug fixes (100%)
- **Iterations Required**: 0
- **TypeScript Errors**: 0

### PDCA Cycle
- **Cycle**: #4 - Comment System Polish
- **Duration**: 1 day
- **Status**: Complete ✅

### Files Modified
- `components/social/CommentSection.tsx` - Avatar display + reply delete
- `app/api/prompts/[id]/comments/route.ts` - GET serialization
- `app/api/comments/route.ts` - POST serialization

---

## [1.4.1] - 2026-03-01

### Added
- User.likeCount field synchronization with notification events
- Admin notifications API endpoint with bulk/selective update operations

### Changed
- Like API now updates both Prompt.likeCount and User.likeCount (received likes counter)
- Admin notifications endpoint now correctly references UserNotification model

### Fixed
- BUG-01: admin/notifications endpoint using non-existent Notification model (switched to UserNotification)
- FR-01: User.likeCount not updating when prompts received likes (now synchronized with Like events)
- User profile page now accurately displays likeCount (received likes from other users)

### Quality Metrics
- **Design Match Rate**: 100% (PASS)
- **Feature Completion**: 2/2 requirements (100%)
- **Iterations Required**: 0
- **TypeScript Errors**: 0

### PDCA Cycle
- **Cycle**: #3 - Notification System Bugfix
- **Duration**: 1 day
- **Status**: Complete ✅

### Files Modified
- `app/api/admin/notifications/route.ts` - Model reference correction
- `app/api/prompts/[id]/like/route.ts` - User likeCount synchronization

---

## [1.4.0] - 2026-02-27

### Added
- Time decay algorithm to trending prompt scoring (10% per day decay)
- View count display in PromptCard footer with Eye icon
- Smart pagination with ellipsis support for >7 page results
- Previous/Next navigation arrows in pagination controls
- `browse_title` and `ai_tools_label` i18n keys across all 6 locales

### Changed
- Home page GENERATION_TYPES labels now dynamically rendered via i18n (removed hardcoded Korean)
- Trending score formula updated to exclude passive viewCount metric
- PromptCard footer restructured to include viewCount display

### Fixed
- Hard-coded Korean text breaking non-Korean locales (i18n consistency)
- Inaccessible pagination for result sets >7 pages
- Trending algorithm favoring all-time accumulated metrics over recency
- Hidden viewCount metric (now visible to users)

### Quality Metrics
- **Design Match Rate**: 100% (PASS)
- **Feature Completion**: 4/4 FRs (100%)
- **File Coverage**: 10/10 (100%)
- **Locale Coverage**: 6/6 (100%)
- **Dependencies Added**: 0 (maintained)

### PDCA Cycle
- **Cycle**: #2 - UX Improvement
- **Duration**: 1 day
- **Status**: Complete ✅

---

## [1.0.0] - 2026-02-24

### Added
- Complete user authentication system (Email/Password + Google OAuth)
- Prompt CRUD operations with full API support
- Browse and discover prompts with filtering by AI tool and category
- Text-based search functionality with MongoDB text indexes
- Social features: likes, bookmarks, comments with reply support
- Copy count tracking for popular prompts
- User profile pages with author information and prompt history
- 6-language support (English, Korean, Japanese, Chinese, Spanish, French)
- Image upload functionality with Cloudinary integration
- Google Analytics integration for usage tracking
- Google AdSense support for monetization
- SEO optimization with metadata and dynamic sitemap generation
- Responsive design with Tailwind CSS v4
- Database layer with Mongoose models for all entities

### Technical Implementation
- Next.js 16.1.6 with App Router
- MongoDB Atlas for cloud database
- NextAuth v4 for authentication
- next-intl v4 for internationalization
- Cloudinary for image hosting
- 7 MongoDB indexes for performance optimization

### Features by Requirement
- **FR-01**: User Authentication (100%) - Email/Password signup, Google OAuth signin, JWT sessions
- **FR-02**: Prompt CRUD (100%) - Create, read, update, delete with soft delete pattern
- **FR-03**: Browse & Filter (100%) - Filtering by AI tool, category, text search, 3 sorting options
- **FR-04**: Social Features (100%) - Likes, bookmarks, comments, copy tracking
- **FR-05**: User Profiles (100%) - Public profiles with username lookup
- **FR-06**: Multilingual Support (100%) - 6 languages with server & client components
- **FR-07**: Image Upload (100%) - Cloudinary integration with 10MB limit
- **FR-08**: Google Analytics (100%) - GA4 page tracking integration
- **FR-09**: Google AdSense (100%) - Ad serving with placeholder support
- **FR-10**: SEO Optimization (100%) - Root metadata, dynamic sitemap

### Pages Delivered
- Home page with hero and featured prompts
- Browse prompts with filters and search
- Create new prompt (protected)
- Prompt detail page with interactions
- Explore by AI tool or category
- User bookmarks (protected)
- User profile pages (public)
- Sign in page (Email, Google OAuth)
- Sign up page with registration

### API Endpoints
- `GET /api/prompts` - List with filtering, search, sorting, pagination
- `POST /api/prompts` - Create prompt
- `GET /api/prompts/:id` - Get detail (ID or slug)
- `PUT /api/prompts/:id` - Update (owner/admin)
- `DELETE /api/prompts/:id` - Soft delete
- `POST /api/prompts/:id/like` - Toggle like
- `POST /api/prompts/:id/bookmark` - Toggle bookmark
- `POST /api/prompts/:id/copy` - Track copy
- `GET /api/prompts/:id/comments` - List comments
- `POST /api/comments` - Create comment/reply
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/upload` - Upload image
- `GET /api/users/[username]` - Get user profile
- `POST /api/auth/signup` - Register user

### Enhancements Beyond Design
- Dynamic sitemap generation for SEO
- 7 MongoDB indexes for query performance
- Username filtering in prompt search
- Hidden status for content moderation
- Report tracking for community safety
- Language field for content classification
- Comment likes for engagement tracking
- Provider tracking for authentication methods
- Email verification field for security

### Quality Metrics
- **Design Match Rate**: 96% (PASS)
- **Feature Completion**: 100% (10/10)
- **Page Coverage**: 100% (8/8)
- **API Endpoints**: 100% (14/14)
- **TypeScript Coverage**: 95%
- **Component Organization**: Fully modular
- **Security**: No hardcoded secrets

### Known Limitations
- Google OAuth, Cloudinary, GA4, AdSense require external configuration
- Placeholder/fallback implementations provided for deferred services

### Deployment Status
- Code complete and tested
- Ready for production deployment
- External service setup required (see docs/04-report/features/promptall.report.md)

---

## Release Information

**PDCA Cycle**: #1 Complete
**Total Duration**: ~4 weeks
**Quality Gate**: ✅ PASS (96% >= 90%)
**Production Ready**: ✅ YES (pending external service setup)

See detailed completion report: [promptall.report.md](features/promptall.report.md)
