import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    provider: { type: String, default: 'credentials' },
    role: { type: String, default: 'user' },
    promptCount: { type: Number, default: 0 },
    image: String,
  }, { timestamps: true });

  const PromptSchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    content: String,
    aiTool: String,
    category: String,
    tags: [String],
    author: mongoose.Schema.Types.ObjectId,
    authorName: String,
    authorUsername: String,
    authorImage: String,
    status: { type: String, default: 'active' },
    likeCount: { type: Number, default: 0 },
    copyCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 },
    language: { type: String, default: 'en' },
    resultImages: { type: [String], default: [] },
    resultText: String,
    isFeatured: { type: Boolean, default: false },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  const Prompt = mongoose.models.Prompt || mongoose.model('Prompt', PromptSchema);

  // Drop and recreate prompt data to fix field names
  await Prompt.deleteMany({});
  console.log('Cleared old prompts');

  // Create admin user
  let user = await User.findOne({ email: 'admin@promptall.net' });
  if (!user) {
    user = await User.create({
      name: 'PromptAll Team',
      username: 'promptall',
      email: 'admin@promptall.net',
      provider: 'credentials',
      role: 'admin',
      promptCount: 0,
    });
    console.log('Created admin user:', user._id);
  } else {
    console.log('Using existing admin user:', user._id);
  }

  const prompts = [
    {
      title: 'Perfect Blog Post Generator',
      slug: 'perfect-blog-post-generator',
      description: 'Generate a comprehensive, SEO-optimized blog post on any topic with this detailed prompt.',
      content: `You are an expert content writer and SEO specialist. Create a comprehensive blog post about [TOPIC] that:

1. **Title**: Write an engaging, SEO-friendly title (include the main keyword)
2. **Introduction**: Hook readers in the first 2 sentences, state the problem, and promise a solution
3. **Main Content** (at least 1500 words):
   - Use H2 and H3 headings for structure
   - Include statistics and data where relevant
   - Add practical examples and case studies
   - Include actionable tips (numbered lists)
4. **SEO Optimization**:
   - Target keyword: [KEYWORD]
   - Include keyword naturally 3-5 times
   - Add LSI keywords throughout
5. **Conclusion**: Summarize key points, include a CTA
6. **Meta Description**: Write a 155-character meta description

Tone: Professional yet conversational
Target audience: [TARGET AUDIENCE]`,
      aiTool: 'chatgpt',
      category: 'writing',
      tags: ['blog', 'SEO', 'content writing', 'marketing'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 142,
      copyCount: 89,
      viewCount: 1250,
      commentCount: 12,
      trendingScore: 95,
      language: 'en',
      isFeatured: true,
    },
    {
      title: 'Code Reviewer Pro',
      slug: 'code-reviewer-pro',
      description: 'Get thorough code reviews with specific suggestions for improvements, bugs, and best practices.',
      content: `Act as a senior software engineer with 10+ years of experience. Review the following code and provide:

**Code to Review:**
\`\`\`
[PASTE YOUR CODE HERE]
\`\`\`

**Language/Framework:** [SPECIFY]

Please analyze and provide:

1. **Bugs & Errors**: List any bugs, logic errors, or potential runtime issues
2. **Performance Issues**: Identify bottlenecks, unnecessary operations, memory leaks
3. **Security Vulnerabilities**: Check for SQL injection, XSS, authentication issues, etc.
4. **Code Quality**:
   - Naming conventions
   - Code readability and maintainability
   - DRY principle violations
   - SOLID principles adherence
5. **Best Practices**: Suggest language/framework-specific best practices
6. **Refactored Version**: Provide an improved version of the most critical section

Format each issue as:
- **Issue**: [Description]
- **Severity**: Critical/High/Medium/Low
- **Fix**: [Specific solution]`,
      aiTool: 'chatgpt',
      category: 'coding',
      tags: ['code review', 'debugging', 'best practices', 'refactoring'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 231,
      copyCount: 178,
      viewCount: 2100,
      commentCount: 24,
      trendingScore: 120,
      language: 'en',
      isFeatured: true,
    },
    {
      title: 'Midjourney Product Photography Prompt',
      slug: 'midjourney-product-photography-prompt',
      description: 'Create stunning professional product photos with this detailed Midjourney prompt template.',
      content: `/imagine prompt: [PRODUCT NAME] product photography, [COLOR] background, studio lighting, shot on Canon EOS R5, 85mm lens, f/2.8 aperture, professional commercial photography, ultra-sharp, high detail, 8K resolution, clean and minimal composition, [MOOD: luxurious/minimalist/vibrant], brand photography style, white seamless background, soft shadow, photorealistic --ar 1:1 --v 6 --style raw --q 2

**Variables to customize:**
- [PRODUCT NAME]: Your specific product (e.g., "perfume bottle", "sneakers", "coffee mug")
- [COLOR]: Background accent color (e.g., "pure white", "soft beige", "midnight blue")
- [MOOD]: Choose the aesthetic: luxurious / minimalist / vibrant / rustic / tech

**Pro Tips:**
- Add "--no text, watermark" to avoid unwanted text
- Use "--chaos 20" for slight variation
- Combine with "--seed [number]" to reproduce similar results
- For transparent bg: add "transparent background, PNG style"`,
      aiTool: 'midjourney',
      category: 'image',
      tags: ['product photography', 'commercial', 'studio', 'e-commerce'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 318,
      copyCount: 256,
      viewCount: 3400,
      commentCount: 31,
      trendingScore: 180,
      language: 'en',
      isFeatured: true,
    },
    {
      title: 'Python Data Analysis Assistant',
      slug: 'python-data-analysis-assistant',
      description: 'Transform your data analysis workflow with this comprehensive Python data science prompt.',
      content: `You are an expert Python data scientist. Help me analyze my dataset:

**Dataset Info:**
- File: [FILENAME.csv/xlsx]
- Shape: [ROWS] rows × [COLUMNS] columns
- Target variable: [TARGET COLUMN]

**Task:** [DESCRIBE YOUR ANALYSIS GOAL]

Please provide:

1. **Exploratory Data Analysis (EDA)**:
\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load and initial inspection
df = pd.read_csv('[FILENAME]')
print(df.info())
print(df.describe())
print(df.isnull().sum())
\`\`\`

2. **Data Cleaning Plan**: Identify and handle:
   - Missing values strategy
   - Outlier detection (IQR method)
   - Data type corrections
   - Duplicate removal

3. **Feature Engineering**: Suggest relevant new features

4. **Visualization**: Create 3-5 most insightful plots

5. **Statistical Analysis**: Run appropriate tests for my goals

6. **Next Steps**: Recommend ML models if applicable

Please write clean, commented Python code I can run directly.`,
      aiTool: 'chatgpt',
      category: 'analysis',
      tags: ['Python', 'data science', 'pandas', 'visualization', 'EDA'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 187,
      copyCount: 134,
      viewCount: 1890,
      commentCount: 19,
      trendingScore: 88,
      language: 'en',
    },
    {
      title: 'Creative Story Writer',
      slug: 'creative-story-writer',
      description: 'Generate compelling short stories or novel chapters with rich characters and vivid descriptions.',
      content: `You are a bestselling fiction author. Write a [LENGTH: short story/chapter] in the [GENRE] genre.

**Story Parameters:**
- Setting: [TIME PERIOD and LOCATION]
- Main character: [NAME], [AGE], [KEY TRAIT]
- Conflict: [INTERNAL/EXTERNAL conflict]
- Theme: [CENTRAL THEME]
- Tone: [DARK/UPLIFTING/MYSTERIOUS/HUMOROUS]

**Writing Requirements:**
1. **Opening Hook**: Start with action, dialogue, or a provocative statement—never with weather or character waking up
2. **Show, Don't Tell**: Use sensory details and specific observations
3. **Pacing**: Vary sentence length. Short for tension. Longer for description and atmosphere.
4. **Dialogue**: Make it natural, character-specific, and purposeful
5. **Conflict Escalation**: Each scene should raise the stakes
6. **Ending**: [OPEN/RESOLVED/TWIST]

**Style inspiration**: [AUTHOR NAME] (optional)
**Word count**: [TARGET WORD COUNT]

Include: vivid metaphors, distinct character voices, subtext in dialogue`,
      aiTool: 'claude',
      category: 'creative',
      tags: ['fiction', 'storytelling', 'creative writing', 'novel'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 95,
      copyCount: 67,
      viewCount: 980,
      commentCount: 8,
      trendingScore: 45,
      language: 'en',
    },
    {
      title: '완벽한 이메일 마케팅 카피라이터',
      slug: 'email-marketing-copywriter-ko',
      description: '높은 오픈율과 클릭율을 달성하는 이메일 마케팅 카피를 작성하는 프롬프트입니다.',
      content: `당신은 10년 경력의 이메일 마케팅 전문가입니다. 다음 정보를 바탕으로 고전환율 이메일을 작성해주세요.

**기본 정보:**
- 제품/서비스: [제품명]
- 타겟 고객: [고객 특성]
- 이메일 목적: [프로모션/온보딩/재구매 유도/정보 제공]
- 핵심 혜택: [주요 혜택 1-3가지]
- CTA (행동 유도): [버튼 텍스트]

**작성 요구사항:**

1. **제목 라인** (3가지 버전):
   - 호기심 유발형
   - 혜택 강조형
   - 긴급성 강조형

2. **프리헤더 텍스트**: 40자 이내

3. **이메일 본문**:
   - 개인화된 인사
   - 공감되는 문제 제시
   - 솔루션 소개 (제품/서비스)
   - 구체적인 혜택 3가지 (불릿 포인트)
   - 사회적 증거 (고객 후기 예시)
   - 강력한 CTA 버튼
   - P.S. 문구 (긴급성 또는 보너스)

4. **최적화 체크리스트**:
   - 스팸 필터 키워드 제거
   - 모바일 친화적 구성
   - 단일 CTA 원칙

톤: [전문적/친근한/긴급한]`,
      aiTool: 'chatgpt',
      category: 'marketing',
      tags: ['이메일 마케팅', '카피라이팅', '마케팅', '전환율'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 76,
      copyCount: 54,
      viewCount: 720,
      commentCount: 6,
      trendingScore: 38,
      language: 'ko',
    },
    {
      title: 'UI/UX Design System Prompt for Figma',
      slug: 'ui-ux-design-system-figma',
      description: 'Create a complete design system with consistent tokens, components, and documentation.',
      content: `Act as a senior UI/UX designer with expertise in design systems. Create a comprehensive design system specification for [PROJECT NAME].

**Brand Information:**
- Industry: [INDUSTRY]
- Target users: [USER DEMOGRAPHIC]
- Brand personality: [3 ADJECTIVES]
- Existing brand colors (if any): [HEX CODES]

**Deliverables:**

### 1. Design Tokens
**Colors:**
- Primary: [Generate 9-shade palette]
- Secondary: [Generate 9-shade palette]
- Semantic: Success, Warning, Error, Info (with light/dark variants)
- Neutral: Gray scale 50-950
- Background & Surface colors

**Typography:**
- Font pairing recommendation (heading + body)
- Type scale: xs(12) sm(14) base(16) lg(18) xl(20) 2xl(24) 3xl(30) 4xl(36) 5xl(48)
- Line heights and letter spacing

**Spacing System:** 4px base unit (4, 8, 12, 16, 24, 32, 48, 64, 96)

**Border Radius:** sm(4) md(8) lg(12) xl(16) full(9999)

### 2. Core Components (specify props & variants):
- Button (variant: primary/secondary/ghost/danger, size: sm/md/lg)
- Input (state: default/focus/error/disabled)
- Card (variant: default/elevated/outlined)
- Badge/Tag
- Modal/Dialog
- Navigation (top/sidebar)

### 3. Accessibility Guidelines
- WCAG 2.1 AA compliance requirements
- Focus states
- Color contrast ratios

### 4. Figma Organization Structure
Suggested page and frame organization`,
      aiTool: 'chatgpt',
      category: 'design',
      tags: ['UI/UX', 'design system', 'Figma', 'tokens', 'components'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 203,
      copyCount: 156,
      viewCount: 2200,
      commentCount: 22,
      trendingScore: 110,
      language: 'en',
      isFeatured: true,
    },
    {
      title: 'Business Strategy Analyst',
      slug: 'business-strategy-analyst',
      description: "Get comprehensive business analysis using proven frameworks like SWOT, Porter's Five Forces, and more.",
      content: `You are a McKinsey-level business strategy consultant. Conduct a comprehensive strategic analysis for:

**Company/Business:** [COMPANY NAME]
**Industry:** [INDUSTRY]
**Current situation:** [BRIEF DESCRIPTION]
**Key question:** [STRATEGIC DECISION OR PROBLEM]

Please provide:

## 1. SWOT Analysis
| Strengths | Weaknesses |
|-----------|------------|
| • ... | • ... |

| Opportunities | Threats |
|---------------|---------|
| • ... | • ... |

## 2. Porter's Five Forces
Rate each force (Low/Medium/High) with reasoning:
- Competitive rivalry:
- Threat of new entrants:
- Bargaining power of suppliers:
- Bargaining power of buyers:
- Threat of substitutes:

## 3. Strategic Options (3 scenarios)
For each option provide:
- Description
- Pros & Cons
- Resource requirements
- Risk level (1-10)
- Expected ROI timeline

## 4. Recommended Strategy
- Primary recommendation with rationale
- 90-day quick wins
- 12-month roadmap (quarterly milestones)
- KPIs to track success

## 5. Risk Mitigation Plan
Top 3 risks and mitigation strategies

Use data-driven reasoning and cite relevant industry trends.`,
      aiTool: 'claude',
      category: 'business',
      tags: ['strategy', 'SWOT', 'business analysis', 'consulting', 'McKinsey'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 156,
      copyCount: 98,
      viewCount: 1560,
      commentCount: 14,
      trendingScore: 72,
      language: 'en',
    },
    {
      title: 'React Component Architect',
      slug: 'react-component-architect',
      description: 'Design scalable, reusable React components with TypeScript, hooks, and best practices.',
      content: `You are a senior React architect. Design and implement the following component:

**Component:** [COMPONENT NAME]
**Purpose:** [WHAT IT DOES]
**Framework:** React + TypeScript
**Styling:** [Tailwind CSS / CSS Modules / Styled Components]

**Requirements:**
- Props interface with proper TypeScript types
- Accessibility (ARIA attributes, keyboard navigation)
- Responsive design
- Performance optimization (memo, callbacks)
- Error boundary support

Please provide:

### 1. Props Interface
\`\`\`typescript
interface [ComponentName]Props {
  // Define all props with JSDoc comments
}
\`\`\`

### 2. Component Implementation
\`\`\`typescript
// Full implementation with hooks, handlers, rendering
\`\`\`

### 3. Usage Examples
\`\`\`tsx
// 3 different use cases showing versatility
\`\`\`

### 4. Storybook Story (optional)
\`\`\`tsx
// Stories for different states/variants
\`\`\`

### 5. Unit Test Skeleton
\`\`\`typescript
// Key test cases with React Testing Library
\`\`\`

Focus on: Clean code, single responsibility, DRY principles`,
      aiTool: 'claude',
      category: 'coding',
      tags: ['React', 'TypeScript', 'component', 'frontend', 'hooks'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 198,
      copyCount: 145,
      viewCount: 1980,
      commentCount: 18,
      trendingScore: 95,
      language: 'en',
    },
    {
      title: 'SEO Content Strategy Planner',
      slug: 'seo-content-strategy-planner',
      description: 'Build a complete 3-month content calendar with keyword research and competitive analysis.',
      content: `You are an expert SEO strategist and content marketer. Create a comprehensive content strategy for:

**Website/Business:** [WEBSITE URL or BUSINESS NAME]
**Niche/Industry:** [INDUSTRY]
**Main product/service:** [DESCRIPTION]
**Current monthly traffic:** [NUMBER or "Just starting"]
**Target audience:** [PERSONA]
**Budget for content:** [HIGH/MEDIUM/LOW]

Please provide:

## 1. Keyword Research (Top 20)
For each keyword include:
| Keyword | Monthly Volume | Difficulty | Intent | Priority |
|---------|---------------|------------|--------|----------|

Focus on: low-hanging fruit (low difficulty, high relevance)

## 2. Competitor Analysis
- Top 3 competitors in SERPs
- Content gaps (topics they miss)
- Link building opportunities

## 3. 3-Month Content Calendar
**Month 1: Foundation**
- Week 1-4: [4 article titles + target keyword + word count + format]

**Month 2: Authority Building**
- Week 5-8: [4 article titles...]

**Month 3: Conversion Focus**
- Week 9-12: [4 article titles...]

## 4. On-Page SEO Checklist
For each piece of content:
- [ ] Title tag formula
- [ ] Meta description template
- [ ] URL structure
- [ ] Internal linking strategy
- [ ] Schema markup recommendations

## 5. KPIs & Tracking
- Traffic goals (Month 1/2/3)
- Ranking targets
- Tools recommended`,
      aiTool: 'chatgpt',
      category: 'marketing',
      tags: ['SEO', 'content marketing', 'keyword research', 'content strategy'],
      author: user._id,
      authorName: 'PromptAll Team',
      authorUsername: 'promptall',
      status: 'active',
      likeCount: 134,
      copyCount: 92,
      viewCount: 1340,
      commentCount: 11,
      trendingScore: 65,
      language: 'en',
    },
  ];

  let created = 0;
  for (const promptData of prompts) {
    await Prompt.create(promptData);
    created++;
    console.log(`Created: ${promptData.title}`);
  }

  await User.findByIdAndUpdate(user._id, { promptCount: created });
  console.log(`\nSeeding complete! Created ${created} prompts.`);
  await mongoose.disconnect();
}

seed().catch(console.error);
