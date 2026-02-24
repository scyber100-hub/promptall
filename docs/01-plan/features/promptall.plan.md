# Plan: promptall

## Feature Overview
**Project**: PromptAll (promptall.net)
**Type**: Full-stack Next.js Web Application
**Goal**: Global AI prompt sharing community platform

## Requirements

### Core Features
- FR-01: User authentication (Email/Password + Google OAuth)
- FR-02: Prompt CRUD (Create, Read, Update, Delete)
- FR-03: Prompt discovery (browse, filter by AI tool / category, search, sort)
- FR-04: Social interactions (likes, bookmarks, comments, copy)
- FR-05: User profiles
- FR-06: Multilingual support (EN, KO, JA, ZH, ES, FR)
- FR-07: Image upload for prompt results
- FR-08: Google Analytics integration
- FR-09: Google AdSense integration
- FR-10: SEO optimization (metadata, OpenGraph)

### AI Tools Supported
ChatGPT, Claude, Gemini, Midjourney, DALL-E, Stable Diffusion, Copilot, Perplexity, Other

### Categories
Writing, Coding, Image, Business, Education, Marketing, Creative, Productivity, Research, Analysis, Design, Other

### Sorting Options
Latest, Popular (by likes), Trending (by trending score)

## Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, next-intl v4
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: NextAuth v4 (JWT strategy)
- **Image Storage**: Cloudinary
- **Analytics**: Google Analytics 4
- **Ads**: Google AdSense

## Pages
- `/[locale]` — Home (hero, featured prompts)
- `/[locale]/prompts` — Browse & filter prompts
- `/[locale]/prompts/new` — Create new prompt (auth required)
- `/[locale]/prompts/[id]` — Prompt detail
- `/[locale]/explore` — Explore by AI tool / category
- `/[locale]/bookmarks` — User bookmarks (auth required)
- `/[locale]/profile/[username]` — User profile
- `/[locale]/auth/signin` — Sign in
- `/[locale]/auth/signup` — Sign up
