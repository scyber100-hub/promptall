import { PromptCard } from '@/components/prompts/PromptCard';

interface RelatedPrompt {
  _id: string;
  title: string;
  description?: string;
  aiTool: string;
  category: string;
  resultImages: string[];
  authorName: string;
  authorUsername: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  slug: string;
}

interface RelatedPromptsProps {
  prompts: RelatedPrompt[];
  locale: string;
}

export function RelatedPrompts({ prompts, locale }: RelatedPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-100 pt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Prompts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {prompts.map((p) => (
          <PromptCard key={p._id} prompt={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
