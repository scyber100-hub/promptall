# Design: prompt-edit

## Status
- Plan: ✅ `docs/01-plan/features/prompt-edit.plan.md`
- Design: 🔄 In Progress

---

## Architecture

```
[Edit Page - Client Component] NEW
  ├─ useParams() → id (slug 또는 _id)
  ├─ useSession() → auth 확인
  ├─ useEffect: GET /api/prompts/{id}
  │   ├─ 401/404 → router.push 상세 페이지
  │   └─ 데이터 로드 → form state 초기화, promptId(_id) 저장
  ├─ 폼 (new/page.tsx 필드 동일)
  └─ handleSubmit: PUT /api/prompts/{promptId}
      └─ 성공 → router.push 상세 페이지

[Detail Page - Server Component] MOD
  ├─ getServerSession(authOptions) 추가
  ├─ isAuthor = session?.user?.id === p.author
  └─ isAuthor → <Link href=".../edit"> Pencil 아이콘
```

**핵심 설계 포인트**: URL의 `id`는 slug일 수 있으므로 GET으로 실제 `_id`를 먼저 조회한 뒤 PUT에 사용한다.

---

## FR-01: 편집 페이지

### `app/[locale]/prompts/[id]/edit/page.tsx` (NEW)

```typescript
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];
const GENERATION_TYPES = ['text', 'image', 'video', 'development'];
const CATEGORIES_BY_TYPE: Record<string, string[]> = {
  text: ['business', 'academic', 'marketing', 'writing', 'education', 'creative', 'productivity', 'other'],
  image: ['illustration', 'photo', 'design', 'art', 'other'],
  video: ['script', 'social', 'animation', 'other'],
  development: ['frontend', 'backend', 'database', 'devops', 'other'],
};

export default function EditPromptPage() {
  const { locale, id } = useParams() as { locale: string; id: string };
  const t = useTranslations();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [promptId, setPromptId] = useState('');  // 실제 MongoDB _id
  const [slug, setSlug] = useState('');
  const [form, setForm] = useState({
    title: '', content: '', description: '',
    aiTool: 'chatgpt', generationType: 'text', category: 'writing',
    tags: '', resultText: '', resultLink: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }
    // 기존 프롬프트 데이터 로드
    fetch(`/api/prompts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.prompt;
        if (!p) { router.push(`/${locale}/prompts/${id}`); return; }

        // 작성자 본인 확인
        const userId = (session.user as any).id;
        const role = (session.user as any).role;
        if (p.author?.toString() !== userId && role !== 'admin') {
          router.push(`/${locale}/prompts/${id}`);
          return;
        }

        setPromptId(p._id.toString());
        setSlug(p.slug || p._id.toString());
        setForm({
          title: p.title ?? '',
          content: p.content ?? '',
          description: p.description ?? '',
          aiTool: p.aiTool ?? 'chatgpt',
          generationType: p.generationType ?? 'text',
          category: p.category ?? 'writing',
          tags: (p.tags ?? []).join(', '),
          resultText: p.resultText ?? '',
          resultLink: p.resultLink ?? '',
        });
        setImages(p.resultImages ?? []);
        setInitializing(false);
      })
      .catch(() => router.push(`/${locale}/prompts/${id}`));
  }, [status, session, id, locale, router]);

  if (status === 'loading' || initializing) return null;

  const categories = CATEGORIES_BY_TYPE[form.generationType] || CATEGORIES_BY_TYPE.text;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'generationType') {
      const newCategories = CATEGORIES_BY_TYPE[value] || CATEGORIES_BY_TYPE.text;
      setForm((prev) => ({ ...prev, generationType: value, category: newCategories[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files.slice(0, 5)) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) uploaded.push(data.url);
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || form.title.length < 5 || form.title.length > 80) {
      setError('Title must be between 5 and 80 characters');
      return;
    }
    if (!form.description || form.description.length < 10 || form.description.length > 160) {
      setError('Description must be between 10 and 160 characters');
      return;
    }
    if (!form.content || form.content.length < 50) {
      setError('Content must be at least 50 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 10),
          resultImages: images,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        trackEvent('prompt_edit', { prompt_id: promptId });
        router.push(`/${locale}/prompts/${data.prompt.slug || promptId}`);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  // 폼 JSX: new/page.tsx와 동일한 필드, 제목만 "Edit Prompt"로 변경
  // 제출 버튼: "Save Changes"
}
```

### 폼 UI 차이점 (new vs edit)

| 항목 | new/page.tsx | edit/page.tsx |
|------|-------------|---------------|
| 페이지 제목 | `t('prompts.new_title')` | `"Edit Prompt"` |
| form 초기값 | 빈 값 | 기존 데이터 |
| images 초기값 | `[]` | 기존 `resultImages` |
| submit 엔드포인트 | `POST /api/prompts` | `PUT /api/prompts/{promptId}` |
| 제출 버튼 텍스트 | `t('prompts.submit_btn')` | `"Save Changes"` |
| 성공 후 이동 | `router.push(.../prompts/${slug})` | 동일 |

---

## FR-02: 편집 버튼 (상세 페이지)

### `app/[locale]/prompts/[id]/page.tsx` 수정 (MOD)

```typescript
// 추가 import
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Eye, ExternalLink, Tag, Pencil } from 'lucide-react';

// PromptDetailPage 함수 내부 상단에 추가
const session = await getServerSession(authOptions);
const isAuthor = !!(session?.user && (session.user as any).id === p.author);

// 액션 버튼 row에 추가 (ShareButtons 다음)
{isAuthor && (
  <Link
    href={`/${locale}/prompts/${p._id}/edit`}
    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
  >
    <Pencil size={14} />
    Edit
  </Link>
)}
```

**Note**: `p._id`를 edit URL에 사용 (slug 대신). slug가 변경될 경우를 고려해 안정적인 `_id` 기반 URL 사용.

---

## File Manifest

| 파일 | 액션 | 변경 내용 |
|------|------|-----------|
| `app/[locale]/prompts/[id]/edit/page.tsx` | NEW | 편집 폼 (초기 데이터 로드 + PUT API) |
| `app/[locale]/prompts/[id]/page.tsx` | MOD | getServerSession + isAuthor + Pencil 편집 버튼 |

**총 2개 파일** (NEW 1 + MOD 1)

---

## Implementation Order

1. `app/[locale]/prompts/[id]/edit/page.tsx` — 편집 페이지 (독립적)
2. `app/[locale]/prompts/[id]/page.tsx` — 편집 버튼 추가 (getServerSession)

---

## Error Handling

| 상황 | 처리 |
|------|------|
| 비로그인 접근 | `router.push(.../signin)` |
| 타인 프롬프트 접근 | `router.push(.../prompts/[id])` |
| GET API 404 | `router.push(.../prompts/[id])` |
| PUT API 실패 | `setError(data.error)` 표시 |
| 이미지 업로드 실패 | 해당 이미지 스킵 (기존 new 로직 동일) |

---

## Type Notes

- `p.author`는 page.tsx에서 이미 `toString()` 직렬화됨 (`getPrompt` 함수 내)
- `GET /api/prompts/[id]` 응답의 `prompt.author`는 직렬화 여부 불확실 → `.toString()` 방어 처리
- `PUT /api/prompts/[id]`는 `findByIdAndUpdate`이므로 반드시 MongoDB `_id` 사용
