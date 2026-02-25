'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarDays, FileText, Heart, PenSquare, Trash2,
  BookmarkIcon, Edit2, X, Check, ExternalLink,
  MessageCircle, Eye,
} from 'lucide-react';
import { formatDate, AI_TOOL_LABELS, CATEGORY_LABELS } from '@/lib/utils';
import { AIServiceIcon } from '@/components/icons/AIServiceIcon';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];
const GENERATION_TYPES = ['text', 'image', 'video', 'development'];
const CATEGORIES_BY_TYPE: Record<string, string[]> = {
  text: ['business', 'academic', 'marketing', 'writing', 'education', 'creative', 'productivity', 'other'],
  image: ['illustration', 'photo', 'design', 'art', 'other'],
  video: ['script', 'social', 'animation', 'other'],
  development: ['frontend', 'backend', 'database', 'devops', 'other'],
};

interface Prompt {
  _id: string;
  title: string;
  content: string;
  description?: string;
  aiTool: string;
  generationType: string;
  category: string;
  tags: string[];
  resultText?: string;
  resultImages: string[];
  resultLink?: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  copyCount: number;
  status: string;
  slug: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email?: string;
  image?: string;
  bio?: string;
  promptCount: number;
  likeCount: number;
  createdAt: string;
  provider: string;
}

interface Props {
  user: User;
  prompts: Prompt[];
  bookmarkedPrompts: Prompt[];
  locale: string;
}

export function MyPageClient({ user, prompts, bookmarkedPrompts, locale }: Props) {
  const [tab, setTab] = useState<'prompts' | 'bookmarks'>('prompts');

  // Profile edit
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [currentName, setCurrentName] = useState(user.name);
  const [currentBio, setCurrentBio] = useState(user.bio ?? '');

  // Prompts state
  const [myPrompts, setMyPrompts] = useState<Prompt[]>(prompts);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Prompt edit
  const [editPrompt, setEditPrompt] = useState<Prompt | null>(null);

  const totalLikes = myPrompts.reduce((s, p) => s + (p.likeCount || 0), 0);

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), bio: editBio.trim() }),
      });
      if (res.ok) {
        setCurrentName(editName.trim());
        setCurrentBio(editBio.trim());
        setEditOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMyPrompts((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    }
  };

  const handlePromptSaved = (updated: Prompt) => {
    setMyPrompts((prev) => prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)));
    setEditPrompt(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
              {user.image ? (
                <Image src={user.image} alt={currentName} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{currentName[0]?.toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{currentName}</h1>
              <p className="text-sm text-slate-400 mt-0.5">@{user.username}</p>
              {currentBio ? (
                <p className="text-sm text-slate-600 mt-2 max-w-md leading-relaxed">{currentBio}</p>
              ) : (
                <p className="text-sm text-slate-300 mt-2 italic">소개글이 없습니다. 편집 버튼을 눌러 추가해보세요.</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1"><CalendarDays size={14} />{formatDate(user.createdAt)} 가입</span>
                <span className="flex items-center gap-1"><FileText size={14} />{myPrompts.length}개 프롬프트</span>
                <span className="flex items-center gap-1"><Heart size={14} />{totalLikes} 좋아요</span>
                <span className="flex items-center gap-1"><BookmarkIcon size={14} />{bookmarkedPrompts.length} 북마크</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setEditName(currentName); setEditBio(currentBio); setEditOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Edit2 size={14} />프로필 편집
            </button>
            <Link
              href={`/${locale}/prompts/new`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PenSquare size={14} />프롬프트 작성
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        <button
          onClick={() => setTab('prompts')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'prompts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          내 프롬프트 ({myPrompts.length})
        </button>
        <button
          onClick={() => setTab('bookmarks')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'bookmarks' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          북마크 ({bookmarkedPrompts.length})
        </button>
      </div>

      {/* My Prompts */}
      {tab === 'prompts' && (
        myPrompts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 text-lg mb-2">아직 작성한 프롬프트가 없습니다</p>
            <Link href={`/${locale}/prompts/new`}
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              <PenSquare size={16} />첫 프롬프트 작성하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPrompts.map((prompt) => (
              <MyPromptCard
                key={prompt._id}
                prompt={prompt}
                locale={locale}
                onEdit={() => setEditPrompt(prompt)}
                onDelete={() => setDeleteConfirm(prompt._id)}
              />
            ))}
          </div>
        )
      )}

      {/* Bookmarks */}
      {tab === 'bookmarks' && (
        bookmarkedPrompts.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkIcon className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 text-lg mb-2">북마크한 프롬프트가 없습니다</p>
            <Link href={`/${locale}/prompts`}
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              프롬프트 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedPrompts.map((prompt) => (
              <BookmarkCard key={prompt._id} prompt={prompt} locale={locale} />
            ))}
          </div>
        )
      )}

      {/* Profile Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">프로필 편집</h2>
              <button onClick={() => setEditOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={50}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                <p className="text-xs text-slate-400 mt-1 text-right">{editName.length}/50</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">소개</label>
                <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={200} rows={3}
                  placeholder="자신을 소개해주세요"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none" />
                <p className="text-xs text-slate-400 mt-1 text-right">{editBio.length}/200</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setEditOpen(false)}
                className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                취소
              </button>
              <button onClick={handleSaveProfile} disabled={saving || !editName.trim()}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5">
                {saving ? '저장 중...' : <><Check size={14} />저장</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Edit Modal */}
      {editPrompt && (
        <EditPromptModal
          prompt={editPrompt}
          onClose={() => setEditPrompt(null)}
          onSaved={handlePromptSaved}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">프롬프트 삭제</h3>
            <p className="text-sm text-slate-500 mb-6">삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                취소
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Prompt Edit Modal ───────────────────────────────────────── */
function EditPromptModal({
  prompt,
  onClose,
  onSaved,
}: {
  prompt: Prompt;
  onClose: () => void;
  onSaved: (p: Prompt) => void;
}) {
  const [form, setForm] = useState({
    title: prompt.title,
    content: prompt.content,
    description: prompt.description ?? '',
    aiTool: prompt.aiTool,
    generationType: prompt.generationType || 'text',
    category: prompt.category,
    tags: (prompt.tags ?? []).join(', '),
    resultText: prompt.resultText ?? '',
    resultLink: prompt.resultLink ?? '',
  });
  const [images, setImages] = useState<string[]>(prompt.resultImages ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = CATEGORIES_BY_TYPE[form.generationType] ?? CATEGORIES_BY_TYPE.text;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'generationType') {
      const newCats = CATEGORIES_BY_TYPE[value] ?? CATEGORIES_BY_TYPE.text;
      setForm((prev) => ({ ...prev, generationType: value, category: newCats[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files.slice(0, 5 - images.length)) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) uploaded.push(data.url);
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || form.title.length < 5 || form.title.length > 80) {
      setError('제목은 5~80자 사이여야 합니다'); return;
    }
    if (!form.description || form.description.length < 10 || form.description.length > 160) {
      setError('설명은 10~160자 사이여야 합니다'); return;
    }
    if (!form.content || form.content.length < 50) {
      setError('프롬프트 내용은 최소 50자 이상이어야 합니다'); return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/prompts/${prompt._id}`, {
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
        onSaved({ ...prompt, ...data.prompt, _id: prompt._id });
      } else {
        setError(data.error || '저장에 실패했습니다');
      }
    } catch {
      setError('오류가 발생했습니다');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">프롬프트 편집</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">제목 *</label>
            <input name="title" value={form.title} onChange={handleChange} maxLength={80}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            <p className={`text-xs text-right mt-1 ${form.title.length > 0 && form.title.length < 5 ? 'text-red-500' : 'text-slate-400'}`}>
              {form.title.length}/80
            </p>
          </div>

          {/* AI Tool + Generation Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">AI 도구 *</label>
              <select name="aiTool" value={form.aiTool} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                {AI_TOOLS.map((t) => <option key={t} value={t}>{AI_TOOL_LABELS[t] || t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">생성 유형 *</label>
              <select name="generationType" value={form.generationType} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                {GENERATION_TYPES.map((gt) => <option key={gt} value={gt}>{gt}</option>)}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">카테고리 *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
              {categories.map((cat) => <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>)}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">프롬프트 내용 *</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={7} maxLength={5000}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-y" />
            <p className={`text-xs text-right mt-1 ${form.content.length > 0 && form.content.length < 50 ? 'text-red-500' : 'text-slate-400'}`}>
              {form.content.length}/5000 {form.content.length > 0 && form.content.length < 50 ? `(최소 50자, ${50 - form.content.length}자 더)` : ''}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">짧은 설명 *</label>
            <input name="description" value={form.description} onChange={handleChange} maxLength={160}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            <p className={`text-xs text-right mt-1 ${form.description.length > 0 && form.description.length < 10 ? 'text-red-500' : 'text-slate-400'}`}>
              {form.description.length}/160
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">태그</label>
            <input name="tags" value={form.tags} onChange={handleChange}
              placeholder="쉼표로 구분 (최대 10개)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>

          {/* Result Text */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">결과 텍스트 (선택)</label>
            <textarea name="resultText" value={form.resultText} onChange={handleChange} rows={3} maxLength={3000}
              placeholder="이 프롬프트로 생성된 결과를 공유해주세요"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-y" />
          </div>

          {/* Result Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">결과 링크 (선택)</label>
            <input name="resultLink" value={form.resultLink} onChange={handleChange} maxLength={500}
              placeholder="https://chat.openai.com/share/..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>

          {/* Result Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">결과 이미지 (선택)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload}
              className="text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
            {uploading && <p className="text-sm text-indigo-600 mt-1">업로드 중...</p>}
            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2 shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            취소
          </button>
          <button onClick={handleSave} disabled={saving || uploading}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5">
            {saving ? '저장 중...' : <><Check size={14} />저장</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── My Prompt Card ──────────────────────────────────────────── */
function MyPromptCard({
  prompt, locale, onEdit, onDelete,
}: {
  prompt: Prompt; locale: string; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col group hover:border-indigo-200 hover:shadow-md transition-all">
      {prompt.resultImages?.[0] ? (
        <div className="aspect-video relative overflow-hidden">
          <Image src={prompt.resultImages[0]} alt={prompt.title} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            prompt.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {prompt.status === 'active' ? '게시중' : '숨김'}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            <AIServiceIcon tool={prompt.aiTool} size={12} />
            {AI_TOOL_LABELS[prompt.aiTool] || prompt.aiTool}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
            {CATEGORY_LABELS[prompt.category] || prompt.category}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1.5 text-sm leading-snug flex-1">{prompt.title}</h3>
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 pt-2.5 border-t border-slate-100">
          <span className="flex items-center gap-1"><Heart size={11} />{prompt.likeCount}</span>
          <span className="flex items-center gap-1"><MessageCircle size={11} />{prompt.commentCount}</span>
          <span className="flex items-center gap-1"><Eye size={11} />{prompt.viewCount}</span>
          <span className="text-slate-300 ml-auto" suppressHydrationWarning>{formatDate(prompt.createdAt)}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Link href={`/${locale}/prompts/${prompt.slug || prompt._id}`}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ExternalLink size={12} />보기
          </Link>
          <button onClick={onEdit}
            className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors">
            <Edit2 size={12} />편집
          </button>
          <button onClick={onDelete}
            className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 size={12} />삭제
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Bookmark Card ───────────────────────────────────────────── */
function BookmarkCard({ prompt, locale }: { prompt: Prompt; locale: string }) {
  return (
    <Link href={`/${locale}/prompts/${prompt.slug || prompt._id}`}>
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col group hover:border-indigo-200 hover:shadow-md transition-all h-full">
        {prompt.resultImages?.[0] ? (
          <div className="aspect-video relative overflow-hidden">
            <Image src={prompt.resultImages[0]} alt={prompt.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ) : (
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              <AIServiceIcon tool={prompt.aiTool} size={12} />
              {AI_TOOL_LABELS[prompt.aiTool] || prompt.aiTool}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              {CATEGORY_LABELS[prompt.category] || prompt.category}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm leading-snug flex-1 group-hover:text-indigo-600 transition-colors">
            {prompt.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto pt-2.5 border-t border-slate-100 mt-2">
            <span className="flex items-center gap-1"><Heart size={11} />{prompt.likeCount}</span>
            <span className="flex items-center gap-1"><MessageCircle size={11} />{prompt.commentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
