import mongoose, { Schema, Document, Model } from 'mongoose';

export type AITool =
  | 'chatgpt' | 'claude' | 'gemini' | 'midjourney'
  | 'dalle' | 'stable-diffusion' | 'copilot' | 'perplexity' | 'other';

export type GenerationType = 'text' | 'image' | 'video' | 'development';

export type Category =
  // text
  | 'business' | 'academic' | 'marketing' | 'writing'
  | 'education' | 'creative' | 'productivity'
  // image
  | 'illustration' | 'photo' | 'design' | 'art'
  // video
  | 'script' | 'social' | 'animation'
  // development
  | 'frontend' | 'backend' | 'database' | 'devops'
  // shared
  | 'other';

export interface IPrompt extends Document {
  title: string;
  content: string;
  description?: string;
  aiTool: AITool;
  generationType: GenerationType;
  category: Category;
  tags: string[];
  resultText?: string;
  resultImages: string[];
  resultLink?: string;
  author: mongoose.Types.ObjectId;
  authorName: string;
  authorUsername: string;
  authorImage?: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  viewCount: number;
  copyCount: number;
  trendingScore: number;
  status: 'active' | 'hidden' | 'deleted';
  reportCount: number;
  slug: string;
  language: string;
  translations: Record<string, { title?: string; description?: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];
export const GENERATION_TYPES: GenerationType[] = ['text', 'image', 'video', 'development'];
export const CATEGORIES = [
  // text
  'business', 'academic', 'marketing', 'writing', 'education', 'creative', 'productivity',
  // image
  'illustration', 'photo', 'design', 'art',
  // video
  'script', 'social', 'animation',
  // development
  'frontend', 'backend', 'database', 'devops',
  // shared
  'other',
];

export const CATEGORIES_BY_TYPE: Record<GenerationType, string[]> = {
  text: ['business', 'academic', 'marketing', 'writing', 'education', 'creative', 'productivity', 'other'],
  image: ['illustration', 'photo', 'design', 'art', 'other'],
  video: ['script', 'social', 'animation', 'other'],
  development: ['frontend', 'backend', 'database', 'devops', 'other'],
};

const PromptSchema = new Schema<IPrompt>(
  {
    title: { type: String, required: true, maxlength: 80 },
    content: { type: String, required: true, maxlength: 5000 },
    description: { type: String, maxlength: 160 },
    aiTool: { type: String, enum: AI_TOOLS, required: true },
    generationType: { type: String, enum: GENERATION_TYPES, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    tags: { type: [String], default: [] },
    resultText: { type: String, maxlength: 3000 },
    resultImages: { type: [String], default: [] },
    resultLink: { type: String, maxlength: 500 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    authorUsername: { type: String, required: true },
    authorImage: { type: String },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    copyCount: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'hidden', 'deleted'], default: 'active' },
    reportCount: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
    language: { type: String, default: 'en' },
    translations: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Indexes
PromptSchema.index({ status: 1, createdAt: -1 });
PromptSchema.index({ status: 1, likeCount: -1 });
PromptSchema.index({ status: 1, trendingScore: -1 });
PromptSchema.index({ status: 1, aiTool: 1, createdAt: -1 });
PromptSchema.index({ status: 1, category: 1, createdAt: -1 });
PromptSchema.index({ status: 1, generationType: 1, createdAt: -1 });
PromptSchema.index({ author: 1, status: 1 });
PromptSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Prompt: Model<IPrompt> = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);
export default Prompt;
