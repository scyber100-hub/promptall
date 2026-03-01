# Gap Analysis: search-discovery

## Summary
- **Date**: 2026-03-01
- **Feature**: search-discovery
- **Match Rate**: 97%
- **Result**: ✅ PASSED (≥ 90%)

---

## Checklist

### FR-01: Header 검색 바
| 요구사항 | 구현 | 상태 |
|----------|------|------|
| Desktop inline 검색 폼 (w-56 → w-72 focus) | `className="w-56 focus:w-72 transition-all..."` | ✅ |
| Mobile searchOpen 상태 + Search 아이콘 버튼 | `const [searchOpen, setSearchOpen] = useState(false)` | ✅ |
| Mobile 검색 패널 (Header 하단 full-width) | `{searchOpen && <div className="md:hidden ...">}` | ✅ |
| handleSearch: router.push + encodeURIComponent | `router.push(\`/\${locale}/search?q=\${encodeURIComponent(q)}\`)` | ✅ |
| useEffect: URL q param pre-fill | `useSearchParams()` 훅 사용 (next.js 권장 방식) | ✅ |
| Search 아이콘 (lucide) left-inside | `<Search className="absolute left-3 top-1/2 -translate-y-1/2 ..."` | ✅ |
| 빈 쿼리 제출 차단 | `if (!q) return;` | ✅ |

**FR-01 결과**: 7/7 ✅

### FR-02: 검색 결과 페이지
| 요구사항 | 구현 | 상태 |
|----------|------|------|
| Server Component (Promise params) | `params: Promise<{locale}>`, `searchParams: Promise<{q,tab}>` | ✅ |
| Prompts 탭: $text + textScore 정렬 | `$text: { $search: q }`, `.sort({ score: { $meta: 'textScore' } })` | ✅ |
| Prompts limit | 설계: 20 → 구현: 24 (3-column grid 최적화) | ⚠️ minor |
| Users 탭: regex 검색 (name/username) | `new RegExp(escaped, 'i')`, `$or: [{ name: regex }, { username: regex }]` | ✅ |
| Users limit 20 | `.limit(20)` | ✅ |
| 탭 전환: Link 기반 | `<Link href={\`\${tabBase}&tab=prompts\`}>` | ✅ |
| 탭 count badge | `<span className="...rounded-full">{prompts.length}</span>` | ✅ |
| 빈 상태 메시지 | `{t('no_results_prompts', { query: q })}` | ✅ |
| 유저 카드: avatar, name, @username, bio | Image/span avatar + name/username/bio | ✅ |
| 유저 카드: promptCount, followerCount | 우측 하단 표시 | ✅ |
| status: 'active' 필터 | Prompts/Users 모두 적용 | ✅ |

**FR-02 결과**: 10/11 ✅ (limit 24 vs 20 — 사소한 차이)

### FR-03: 유저 검색 API
| 요구사항 | 구현 | 상태 |
|----------|------|------|
| GET /api/search/users 신규 파일 | `app/api/search/users/route.ts` 생성 | ✅ |
| q, page, limit 파라미터 | `searchParams.get('q')`, `page`, `limit` | ✅ |
| regex escape | `q.replace(/[.*+?^${}()...]/g, '\\$&')` | ✅ |
| 대소문자 무관 검색 | `new RegExp(escaped, 'i')` | ✅ |
| status: 'active' 필터 | `{ $or: [...], status: 'active' }` | ✅ |
| 필드 선택 | `.select('_id name username image bio followerCount promptCount')` | ✅ |
| 직렬화 | `u._id.toString()` | ✅ |
| 응답: users, total, page, pages | `NextResponse.json({ users, total, page, pages })` | ✅ |
| 빈 q 처리 | `if (!q)` 빈 배열 반환 | ✅ |

**FR-03 결과**: 9/9 ✅

### FR-04: PromptFilters i18n
| 요구사항 | 구현 | 상태 |
|----------|------|------|
| "유형" → `t('prompts.filter_type')` | ✅ 교체됨 | ✅ |
| "카테고리" → `t('prompts.filter_category')` | ✅ 교체됨 | ✅ |
| "AI 도구" → `t('prompts.filter_ai_tool')` | ✅ 교체됨 | ✅ |
| "전체" → `t('prompts.filter_all')` | ✅ 교체됨 (3곳 모두) | ✅ |

**FR-04 결과**: 4/4 ✅

### Locale 파일 (6개)
| 파일 | search 네임스페이스 | filter 키 4개 | 상태 |
|------|---------------------|---------------|------|
| messages/en.json | ✅ 8키 | ✅ | PASS |
| messages/ko.json | ✅ 8키 | ✅ | PASS |
| messages/ja.json | ✅ | ✅ | PASS |
| messages/zh.json | ✅ | ✅ | PASS |
| messages/es.json | ✅ 8키 | ✅ | PASS |
| messages/fr.json | ✅ 8키 | ✅ | PASS |

**Locale 결과**: 6/6 ✅

---

## Gap Details

### [MINOR] Prompts 검색 limit: 24 vs 설계 20
- **설계**: `.limit(20)`
- **구현**: `.limit(24)`
- **영향**: 없음 (3-column 그리드 기준 8행 = 24가 더 자연스러운 페이지 단위)
- **판정**: 허용 가능한 개선

### [INFO] Header useEffect 구현 방식
- **설계**: `new URL(window.location.href).searchParams.get('q')`
- **구현**: `useSearchParams()` 훅 + `.get('q')` (next/navigation)
- **판정**: Next.js App Router 권장 방식으로 더 적합

---

## Match Rate 계산

| FR | 충족 | 전체 | 비율 |
|----|------|------|------|
| FR-01 | 7 | 7 | 100% |
| FR-02 | 10 | 11 | 91% |
| FR-03 | 9 | 9 | 100% |
| FR-04 | 4 | 4 | 100% |
| Locale | 6 | 6 | 100% |
| **합계** | **36** | **37** | **97%** |

---

## 결론

**Match Rate: 97% — ✅ PASSED**

유일한 차이점은 Prompts 탭의 limit (20→24)으로, 3-column 그리드에 더 적합한 값으로 의도적으로 변경된 것. 기능적 회귀 없음.

다음 단계: `/pdca report search-discovery`
