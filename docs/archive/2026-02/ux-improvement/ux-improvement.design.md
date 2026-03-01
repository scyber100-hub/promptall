# Design: ux-improvement (PDCA Cycle #2)

## Overview
**Feature**: UX Improvement — i18n fix, trending algorithm, viewCount, pagination
**Phase**: Design
**Based on**: ux-improvement.plan.md

---

## FR-01: Fix Home Page Hard-coded Korean Strings

### Problem (exact lines)
`/app/[locale]/page.tsx`:
- Line 28-31: `GENERATION_TYPES` array uses hardcoded labels (`'텍스트'`, `'이미지'`, `'동영상'`, `'개발'`)
- Line 161: `<h2>탐색하기</h2>` — no i18n key
- Line 164: `전체 보기` link — should use `t('view_all')` (key exists in `home` namespace)
- Line 190: `AI 도구` divider — no i18n key

### Solution

#### 1-A. GENERATION_TYPES — remove hardcoded `label`, use i18n at render time

**Before** (`/app/[locale]/page.tsx` lines 28-31):
```tsx
const GENERATION_TYPES = [
  { key: 'text', label: '텍스트', icon: FileText, ... },
  { key: 'image', label: '이미지', icon: Image, ... },
  { key: 'video', label: '동영상', icon: Video, ... },
  { key: 'development', label: '개발', icon: Code2, ... },
];
```

**After** — remove `label` field:
```tsx
const GENERATION_TYPES = [
  { key: 'text', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { key: 'image', icon: Image, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
  { key: 'video', icon: Video, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { key: 'development', icon: Code2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
];
```

Add `tGenType` to the component imports:
```tsx
const tGenType = await getTranslations('generation_types');
// Note: generation_types.{text,image,video,development} keys already exist in all 6 locales
```

Render: `{tGenType(key as any)}` instead of `{label}`

#### 1-B. Add missing i18n keys to all 6 locale files

New keys needed in `home` namespace:
```json
"browse_title": "Browse",       // en
"ai_tools_label": "AI Tools"    // en
```

| Locale | `home.browse_title` | `home.ai_tools_label` |
|--------|---------------------|-----------------------|
| en | `"Browse"` | `"AI Tools"` |
| ko | `"탐색하기"` | `"AI 도구"` |
| ja | `"探索する"` | `"AIツール"` |
| zh | `"探索"` | `"AI工具"` |
| es | `"Explorar"` | `"Herramientas AI"` |
| fr | `"Explorer"` | `"Outils AI"` |

#### 1-C. Update home page JSX

Line 161: `탐색하기` → `{t('browse_title')}`
Line 164: `전체 보기` → `{t('view_all')}` (key already exists)
Line 190: `AI 도구` → `{t('ai_tools_label')}`

### Files Changed
- `/app/[locale]/page.tsx` — 4 locations
- `/messages/en.json` — add 2 keys
- `/messages/ko.json` — add 2 keys
- `/messages/ja.json` — add 2 keys
- `/messages/zh.json` — add 2 keys
- `/messages/es.json` — add 2 keys
- `/messages/fr.json` — add 2 keys

---

## FR-02: Trending Algorithm Time Decay

### Problem
Current formula in `/app/api/cron/trending/route.ts`:
```ts
const score = wLikes * 3 + wBookmarks * 2 + p.viewCount * 0.05 + p.copyCount * 0.5;
```
No time decay → old prompts with high cumulative stats dominate trending permanently.

### Solution

Add `createdAt` to the DB query and compute `ageInDays` decay:

```ts
// Fetch prompts with createdAt
const prompts = await Prompt.find({ status: 'active' })
  .select('_id viewCount copyCount createdAt')
  .lean();

// In bulkOps map:
const now = Date.now();
const ageInDays = (now - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
const decay = 1 / (1 + ageInDays * 0.1);  // 50% at 10 days, 25% at 30 days
const score = (wLikes * 3 + wBookmarks * 2 + p.copyCount * 0.5) * decay;
```

**Decay table**:
| Age (days) | Decay factor |
|-----------|-------------|
| 0 | 1.00 (100%) |
| 7 | 0.59 (59%) |
| 14 | 0.42 (42%) |
| 30 | 0.25 (25%) |
| 90 | 0.10 (10%) |

Note: `viewCount` removed from formula (passive accumulation distorts score over time).

### Files Changed
- `/app/api/cron/trending/route.ts` — update select + score formula

---

## FR-03: Show View Count in PromptCard

### Problem
`viewCount` exists in model and is shown on detail page, but `/components/prompts/PromptCard.tsx`
doesn't include it in the footer stats row.

### Solution

Add `viewCount` to `PromptCardProps.prompt` interface and footer:

**Interface addition**:
```ts
interface PromptCardProps {
  prompt: {
    // ... existing fields
    viewCount: number;  // add this
  };
  locale: string;
}
```

**Footer addition** (after likeCount, before commentCount):
```tsx
<span className="flex items-center gap-1 text-xs">
  <Eye size={12} />
  {prompt.viewCount}
</span>
```

Add `Eye` to lucide-react import.

Also ensure `viewCount` is included in serialization helpers:
- `/app/[locale]/page.tsx` `serializePrompt()` — add `viewCount: prompt.viewCount ?? 0`
- `/app/[locale]/prompts/page.tsx` serialization map — add `viewCount: p.viewCount ?? 0`

### Files Changed
- `/components/prompts/PromptCard.tsx`
- `/app/[locale]/page.tsx` — serializePrompt
- `/app/[locale]/prompts/page.tsx` — serialization

---

## FR-04: Smart Pagination for Large Page Sets

### Problem
`/app/[locale]/prompts/page.tsx` line 132:
```tsx
{Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(...)}
```
When totalPages > 7, pages 8+ are unreachable (no "next" button navigates beyond page 7 either).

### Solution

Replace simple array with smart pagination that shows: `1 ... 4 5 6 ... 20`

```tsx
function getPaginationRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const delta = 2; // pages around current
  const range: (number | '...')[] = [];

  // Always show first
  range.push(1);

  // Left ellipsis
  if (current - delta > 2) range.push('...');

  // Pages around current
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  // Right ellipsis
  if (current + delta < total - 1) range.push('...');

  // Always show last
  range.push(total);

  return range;
}
```

Render `'...'` as a non-clickable span.

### Files Changed
- `/app/[locale]/prompts/page.tsx` — replace pagination JSX + add helper function

---

## Implementation Order

1. **FR-01** (i18n fix) — message files first, then page.tsx update
2. **FR-03** (viewCount in card) — add to serializers + PromptCard
3. **FR-02** (trending decay) — cron route update
4. **FR-04** (pagination) — prompts page update

## Summary of File Changes

| File | Change | FR |
|------|--------|-----|
| `/app/[locale]/page.tsx` | Fix hardcoded Korean, add tGenType, add viewCount to serializer | FR-01, FR-03 |
| `/app/[locale]/prompts/page.tsx` | Smart pagination + add viewCount to serializer | FR-03, FR-04 |
| `/components/prompts/PromptCard.tsx` | Add viewCount prop + Eye icon in footer | FR-03 |
| `/app/api/cron/trending/route.ts` | Time decay formula | FR-02 |
| `/messages/en.json` | Add browse_title, ai_tools_label | FR-01 |
| `/messages/ko.json` | Add browse_title, ai_tools_label | FR-01 |
| `/messages/ja.json` | Add browse_title, ai_tools_label | FR-01 |
| `/messages/zh.json` | Add browse_title, ai_tools_label | FR-01 |
| `/messages/es.json` | Add browse_title, ai_tools_label | FR-01 |
| `/messages/fr.json` | Add browse_title, ai_tools_label | FR-01 |

**Total files**: 10
**New dependencies**: None
