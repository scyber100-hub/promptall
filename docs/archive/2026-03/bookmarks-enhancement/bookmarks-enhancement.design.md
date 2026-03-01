# Design: Bookmarks 페이지 강화

## Reference
- Plan: `docs/01-plan/features/bookmarks-enhancement.plan.md`

## Requirements

### i18n: messages/*.json bookmarks 네임스페이스 추가

| ID | 요구사항 | 파일 |
|----|---------|------|
| REQ-01 | `messages/en.json` — `bookmarks` 네임스페이스 추가 (6개 키) | `messages/en.json` |
| REQ-02 | `messages/ko.json` — `bookmarks` 네임스페이스 추가 | `messages/ko.json` |
| REQ-03 | `messages/ja.json` — `bookmarks` 네임스페이스 추가 | `messages/ja.json` |
| REQ-04 | `messages/zh.json` — `bookmarks` 네임스페이스 추가 | `messages/zh.json` |
| REQ-05 | `messages/es.json` — `bookmarks` 네임스페이스 추가 | `messages/es.json` |
| REQ-06 | `messages/fr.json` — `bookmarks` 네임스페이스 추가 | `messages/fr.json` |

### BUG 수정: 하드코딩 텍스트 → i18n

| ID | 요구사항 | 파일 |
|----|---------|------|
| REQ-07 | `h1` — `"My Bookmarks"` → `{t('title')}` | `app/[locale]/bookmarks/page.tsx` |
| REQ-08 | 빈 상태 제목 — `"No bookmarks yet"` → `{t('empty_title')}` | `app/[locale]/bookmarks/page.tsx` |
| REQ-09 | 빈 상태 설명 — `"Save prompts..."` → `{t('empty_desc')}` | `app/[locale]/bookmarks/page.tsx` |
| REQ-10 | CTA — `"Browse Prompts"` → `{t('browse')}` | `app/[locale]/bookmarks/page.tsx` |

### FR-01: 페이지네이션

| ID | 요구사항 | 파일 |
|----|---------|------|
| REQ-11 | `searchParams: Promise<{ page?: string }>` prop 추가 | `app/[locale]/bookmarks/page.tsx` |
| REQ-12 | `const page = parseInt(searchParams.page \|\| '1')`, `const limit = 12` | `app/[locale]/bookmarks/page.tsx` |
| REQ-13 | `Bookmark.find({ userId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)` | `app/[locale]/bookmarks/page.tsx` |
| REQ-14 | `Bookmark.countDocuments({ userId })` → `total` 변수, 헤더에 `({total})` 표시 | `app/[locale]/bookmarks/page.tsx` |
| REQ-15 | Prev/Next 페이지네이션 UI — `?page=N` 링크, 첫 페이지에서 Prev 비활성, 마지막 페이지에서 Next 비활성 | `app/[locale]/bookmarks/page.tsx` |
| REQ-16 | `getTranslations('bookmarks')` import 추가, `t` 변수 선언 | `app/[locale]/bookmarks/page.tsx` |

## i18n Values

| key | en | ko | ja | zh | es | fr |
|-----|----|----|----|----|----|----|
| `title` | My Bookmarks | 내 북마크 | マイブックマーク | 我的书签 | Mis favoritos | Mes favoris |
| `empty_title` | No bookmarks yet | 북마크가 없습니다 | ブックマークがありません | 暂无书签 | Sin favoritos aún | Aucun favori |
| `empty_desc` | Save prompts you love by clicking the bookmark icon. | 북마크 아이콘을 클릭하여 마음에 드는 프롬프트를 저장하세요. | ブックマークアイコンをクリックしてお気に入りのプロンプトを保存しましょう。 | 点击书签图标收藏您喜爱的提示词。 | Haz clic en el ícono de marcador para guardar los prompts. | Cliquez sur l'icône favori pour sauvegarder les prompts. |
| `browse` | Browse Prompts | 프롬프트 탐색 | プロンプトを探す | 浏览提示词 | Explorar Prompts | Explorer les Prompts |
| `prev` | Previous | 이전 | 前へ | 上一页 | Anterior | Précédent |
| `next` | Next | 다음 | 次へ | 下一页 | Siguiente | Suivant |

## Pagination UI Spec

```
헤더: My Bookmarks (총 N개)
...
[← Previous]  [Next →]   (총 페이지 수 초과 시 비활성화)
```

- 12개/페이지
- prev: `page > 1` 일 때만 활성
- next: `page * limit < total` 일 때만 활성
- 페이지 1이고 total <= 12이면 페이지네이션 미표시

## Implementation Checklist

### messages/ (6 files)
- [ ] REQ-01~06: 6개 언어에 `bookmarks` 네임스페이스 추가 (6개 키 각각)

### app/[locale]/bookmarks/page.tsx
- [ ] REQ-07: `"My Bookmarks"` → `{t('title')}`
- [ ] REQ-08: `"No bookmarks yet"` → `{t('empty_title')}`
- [ ] REQ-09: `"Save prompts..."` → `{t('empty_desc')}`
- [ ] REQ-10: `"Browse Prompts"` → `{t('browse')}`
- [ ] REQ-11: `searchParams` prop 추가
- [ ] REQ-12: page/limit 변수 선언
- [ ] REQ-13: skip/limit 쿼리 수정
- [ ] REQ-14: countDocuments + total 헤더 표시
- [ ] REQ-15: Prev/Next 페이지네이션 UI
- [ ] REQ-16: `getTranslations('bookmarks')` 추가

## Total Requirements: 16
