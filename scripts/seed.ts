import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

function makeSlug(base: string): string {
  return base
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60) + '-' + Math.random().toString(36).slice(2, 8);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const UserSchema = new mongoose.Schema({
    name: String, username: String, email: String, password: String,
    provider: { type: String, default: 'email' },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'active' },
    promptCount: { type: Number, default: 0 },
    image: String,
  }, { timestamps: true });

  const PromptSchema = new mongoose.Schema({
    title: String, slug: String, description: String, content: String,
    aiTool: String, generationType: String, category: String,
    tags: [String],
    author: mongoose.Schema.Types.ObjectId,
    authorName: String, authorUsername: String, authorImage: String,
    status: { type: String, default: 'active' },
    resultText: String,
    resultImages: { type: [String], default: [] },
    resultLink: String,
    likeCount: { type: Number, default: 0 },
    copyCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },
    language: { type: String, default: 'en' },
    translations: { type: mongoose.Schema.Types.Mixed, default: {} },
    isFeatured: { type: Boolean, default: false },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  const Prompt = mongoose.models.Prompt || mongoose.model('Prompt', PromptSchema);

  await Prompt.deleteMany({});
  console.log('Cleared old prompts');

  let user = await User.findOne({ email: 'admin@promptall.net' });
  if (!user) {
    user = await User.create({
      name: 'PromptAll Team', username: 'promptall',
      email: 'admin@promptall.net', provider: 'email',
      role: 'admin', status: 'active', promptCount: 0,
    });
  }

  const prompts = [

    // ═══════════════════════════════════════════════════════
    // TEXT — 10 prompts
    // ═══════════════════════════════════════════════════════
    {
      title: 'Perfect Blog Post Generator',
      slug: makeSlug('perfect-blog-post-generator'),
      description: 'Generate a comprehensive, SEO-optimized blog post with headings, statistics, and a strong CTA.',
      content: `You are an expert content writer and SEO specialist. Create a comprehensive blog post about [TOPIC].

**Requirements:**
- Title: SEO-friendly, include main keyword
- Introduction: Hook in 2 sentences, state the problem, promise a solution
- Main Content (1,500+ words):
  - Use H2/H3 headings for structure
  - Include statistics and data
  - Add practical examples and case studies
  - Numbered actionable tips
- SEO: Target keyword [KEYWORD], use it 3-5 times naturally
- Conclusion: Summarize + strong CTA
- Meta Description: 155 characters

**Target audience:** [AUDIENCE]
**Tone:** Professional yet conversational`,
      aiTool: 'chatgpt',
      generationType: 'text',
      category: 'writing',
      tags: ['blog', 'SEO', 'content writing', 'copywriting'],
      resultText: `# 10 Proven Strategies to Boost Your Productivity in 2024

Are you constantly running out of hours in the day? You're not alone—but top performers have cracked the code.

## Why Most Productivity Advice Fails
Studies show 68% of workers feel they don't have enough time (McKinsey, 2023). The problem isn't effort—it's *system design*.

## 1. Time-Block Your Calendar
Assign every task a specific time slot instead of maintaining a to-do list...

## 2. Apply the 2-Minute Rule
If a task takes less than 2 minutes, do it immediately...

## 3. Weekly Reviews (Sunday Planning Session)
Spend 30 minutes every Sunday reviewing the past week and planning the next...

**Meta Description:** Discover 10 science-backed productivity strategies used by top performers. Boost your output by 40% starting today.`,
      likeCount: 342, copyCount: 218, viewCount: 3840, commentCount: 28, bookmarkCount: 89, trendingScore: 248,
      isFeatured: true,
    },
    {
      title: 'Creative Story Writer — Novel Chapter Generator',
      slug: makeSlug('creative-story-writer-novel-chapter'),
      description: 'Generate compelling short stories or novel chapters with rich characters, vivid descriptions, and perfect pacing.',
      content: `You are a bestselling fiction author. Write a [LENGTH: short story / chapter] in the [GENRE] genre.

**Story Parameters:**
- Setting: [TIME PERIOD and LOCATION]
- Main character: [NAME], [AGE], [KEY TRAIT]
- Conflict: [INTERNAL / EXTERNAL]
- Theme: [CENTRAL THEME]
- Tone: [DARK / UPLIFTING / MYSTERIOUS / HUMOROUS]

**Writing Rules:**
1. Opening Hook: Start with action or dialogue—never weather or waking up
2. Show, Don't Tell: Sensory details and specific observations
3. Pacing: Short sentences for tension. Longer for atmosphere.
4. Dialogue: Natural, character-specific, purposeful
5. Ending: [OPEN / RESOLVED / TWIST]

Style inspiration: [AUTHOR] (optional)
Word count: [TARGET]`,
      aiTool: 'claude',
      generationType: 'text',
      category: 'creative',
      tags: ['fiction', 'storytelling', 'creative writing', 'novel'],
      resultText: `The rain hadn't stopped for three days when Maya finally broke into the old lighthouse.

She didn't plan it—plans required hope, and she'd run out of that somewhere between Portland and the Oregon coast. The padlock gave easily. Everything on this stretch of highway had given up fighting the salt air.

Inside, the smell hit her first: machine oil and something older, like a church nobody prayed in anymore. She clicked on her flashlight and swept it across the spiral staircase.

"You planning to stay long?"

Maya spun. A boy—maybe sixteen—sat cross-legged on a storage trunk, a paperback balanced on his knee. He didn't look up.

"How did you—" she started.

"Second-story window. Loose hinge." He turned a page. "Same way you're going to leave, probably."

She stared at him. He had her father's eyes. That was impossible. Her father was dead.`,
      likeCount: 198, copyCount: 134, viewCount: 2240, commentCount: 21, bookmarkCount: 52, trendingScore: 145,
    },
    {
      title: 'Email Marketing Copywriter — High Open Rate',
      slug: makeSlug('email-marketing-copywriter-high-open-rate'),
      description: 'Write high-converting email campaigns with 3 subject line variations, compelling body copy, and strong CTA.',
      content: `You are a top email marketing specialist. Write a conversion-optimized email for:

**Product/Service:** [NAME]
**Target audience:** [DESCRIPTION]
**Email goal:** [PROMOTION / ONBOARDING / WIN-BACK / NEWSLETTER]
**Key benefit:** [MAIN VALUE PROPOSITION]
**CTA text:** [BUTTON TEXT]

Deliver:

1. **Subject Lines (3 versions):**
   - Curiosity-driven
   - Benefit-focused
   - Urgency-driven

2. **Preheader:** Under 50 characters

3. **Email Body:**
   - Personalized greeting
   - Empathetic problem statement
   - Solution introduction
   - 3 benefits (bullet points)
   - Social proof snippet
   - Single strong CTA
   - P.S. line (bonus or deadline)

4. **Spam Filter Checklist:**
   - No spam trigger words
   - Single CTA principle
   - Mobile-friendly structure`,
      aiTool: 'chatgpt',
      generationType: 'text',
      category: 'marketing',
      tags: ['email marketing', 'copywriting', 'conversion', 'CTR'],
      resultText: `**Subject Lines:**
① [Curiosity] "Why 3,200 teams stopped using spreadsheets last month"
② [Benefit] "Cut your reporting time from 3 hours to 20 minutes"
③ [Urgency] "Free Premium access ends tonight at midnight"

**Preheader:** 30-day money-back guarantee included

---

Hi Sarah 👋

Still spending Friday afternoons building reports nobody reads?

I've been there — 40 hours a month lost to copy-paste hell.

That's why we built FlowDesk:
✅ Auto-generated reports (one click)
✅ Live team dashboard
✅ Slack + Notion integration

> "We went from 3-hour weekly reports to 15 minutes." — James K., Product Lead

[→ Start Free for 30 Days]

P.S. Sign up today and get 50 Premium templates free. Offer expires at midnight.`,
      likeCount: 287, copyCount: 198, viewCount: 3120, commentCount: 19, bookmarkCount: 74, trendingScore: 198,
    },
    {
      title: 'Business Strategy Analyst — SWOT & Porter\'s Five Forces',
      slug: makeSlug('business-strategy-analyst-swot-porters'),
      description: 'McKinsey-level business analysis with SWOT, competitive forces, 3 strategic options, and 90-day execution roadmap.',
      content: `You are a McKinsey-level strategy consultant. Conduct a full strategic analysis for:

**Company:** [NAME]
**Industry:** [SECTOR]
**Situation:** [BRIEF CONTEXT]
**Key question:** [STRATEGIC DECISION]

Provide:

## 1. SWOT Analysis (table format)

## 2. Porter's Five Forces
Rate each force (Low/Medium/High) with evidence:
- Competitive rivalry
- Threat of new entrants
- Supplier power
- Buyer power
- Threat of substitutes

## 3. Strategic Options (3 scenarios)
For each: description, pros/cons, resources needed, risk (1-10), ROI timeline

## 4. Recommended Strategy
- Primary recommendation + rationale
- 90-day quick wins
- 12-month roadmap (quarterly milestones)
- 5 KPIs to track

## 5. Risk Mitigation
Top 3 risks and response strategies`,
      aiTool: 'claude',
      generationType: 'text',
      category: 'business',
      tags: ['strategy', 'SWOT', 'business analysis', 'consulting'],
      resultText: `## SWOT — FreshCart (Online Grocery, SE Asia)

| Strengths | Weaknesses |
|-----------|------------|
| Same-day delivery in 3 cities | CAC $28/user (industry avg $18) |
| Proprietary cold-chain | Limited to 4,200 SKUs vs 12,000 competitor |

| Opportunities | Threats |
|---------------|---------|
| Q-commerce +31% YoY | Grab/Gojek entering grocery vertical |
| 8 untapped Tier-2 cities | Fuel costs +18% YoY |

## Porter's Five Forces
- Rivalry: **High** — 4 funded competitors
- New entrants: **Medium** — cold-chain CAPEX is a barrier
- Supplier power: **Low** — 200+ contracted farms

## Recommendation
**Franchise to Tier-2 cities** — lower CAPEX, faster entry.
Q1 quick win: 2 dark stores in Bandung via existing logistics partners.
Target: 15% market share in new cities within 18 months.`,
      likeCount: 412, copyCount: 298, viewCount: 4560, commentCount: 38, bookmarkCount: 112, trendingScore: 312,
      isFeatured: true,
    },
    {
      title: 'SEO Content Strategy — 3-Month Calendar',
      slug: makeSlug('seo-content-strategy-3-month-calendar'),
      description: 'Build a complete 3-month SEO content calendar with keyword research, competitor gaps, and monthly traffic targets.',
      content: `You are an expert SEO strategist. Build a content strategy for:

**Website:** [URL or BUSINESS NAME]
**Niche:** [INDUSTRY]
**Product/Service:** [DESCRIPTION]
**Monthly traffic now:** [NUMBER or "Just starting"]
**Audience:** [PERSONA]

Deliver:

## 1. Keyword Research (Top 20)
| Keyword | Volume | Difficulty | Intent | Priority |
|---------|--------|------------|--------|----------|

Focus on low-difficulty, high-relevance quick wins.

## 2. Competitor Analysis
- Top 3 SERP competitors
- Content gaps they miss
- Backlink opportunities

## 3. 3-Month Calendar
**Month 1 — Foundation:** 4 articles (title + keyword + wordcount + format)
**Month 2 — Authority:** 4 articles
**Month 3 — Conversion:** 4 articles

## 4. On-Page Template
- Title tag formula
- Meta description pattern
- Internal linking rules

## 5. Traffic Goals
Month 1 / 2 / 3 targets + tracking tools`,
      aiTool: 'chatgpt',
      generationType: 'text',
      category: 'marketing',
      tags: ['SEO', 'content marketing', 'keyword research', 'content calendar'],
      resultText: `## Top Keywords — SaaS Project Management

| Keyword | Volume | KD | Intent | Priority |
|---------|--------|----|--------|----------|
| trello alternative | 8,100 | 42 | Commercial | ⭐ High |
| free project tracker | 5,400 | 35 | Transactional | ⭐ High |
| kanban board online | 2,900 | 28 | Informational | ⭐ High |

## Month 1 Content Plan
- W1: "7 Best Trello Alternatives in 2024" — 2,500 words
- W2: "How to Build a Kanban Board in 10 Minutes" — 1,800 words
- W3: "Free Project Management Template Pack" — 1,200 + download
- W4: "Agile vs Scrum vs Kanban: Which Fits Your Team?" — 2,000 words

**Traffic goal:** 800 organic visitors by end of Month 1
**Tools:** Ahrefs, Surfer SEO, Google Search Console`,
      likeCount: 356, copyCount: 245, viewCount: 3890, commentCount: 32, bookmarkCount: 98, trendingScore: 272,
      isFeatured: true,
    },
    {
      title: 'Academic Research Paper Outline & Abstract',
      slug: makeSlug('academic-research-paper-outline-abstract'),
      description: 'Create a structured academic paper with literature review, methodology, and properly formatted citations.',
      content: `You are an expert academic writer. Create a research paper outline for:

**Topic:** [RESEARCH TOPIC]
**Field:** [DISCIPLINE]
**Paper type:** [Literature Review / Empirical Study / Case Study]
**Word count:** [TARGET]
**Citation style:** [APA 7th / MLA / Chicago / IEEE]

Provide:

## 1. Abstract (250 words)
Background → Objective → Methods → Results → Conclusion

## 2. Introduction
- Background and context
- Problem statement and research gap
- Research questions (3 max)
- Thesis statement

## 3. Literature Review
- Theoretical framework
- Key themes as subheadings
- 15 source suggestions with search terms

## 4. Methodology
- Research design + rationale
- Data collection and analysis
- Sample description
- Limitations

## 5. Results & Discussion Structure
- Findings by research question
- Comparison with existing literature

## 6. Conclusion
- Summary, contributions, future directions

## 7. Sample References (5 properly formatted)`,
      aiTool: 'claude',
      generationType: 'text',
      category: 'academic',
      tags: ['research paper', 'academic writing', 'literature review', 'APA'],
      resultText: `## Abstract

Background: Remote work adoption accelerated dramatically after COVID-19, with 58% of U.S. workers now working remotely at least part-time (Pew Research, 2023).

Objective: This study examines the relationship between remote work frequency, autonomy perception, and psychological well-being.

Methods: Cross-sectional survey (N = 847) across 12 industries using the Warwick-Edinburgh Mental Wellbeing Scale (WEMWBS) and Job Autonomy Scale via Qualtrics.

Results: Remote workers with high autonomy showed significantly higher well-being scores (M = 52.4, SD = 7.2) vs low-autonomy workers (M = 41.8, SD = 9.1), F(2, 844) = 47.3, p < .001.

Conclusion: Autonomy mediates the remote work–well-being relationship. Organizations should prioritize flexible scheduling over rigid mandates.

**Keywords:** remote work, psychological well-being, job autonomy, knowledge workers`,
      likeCount: 223, copyCount: 167, viewCount: 2450, commentCount: 18, bookmarkCount: 61, trendingScore: 168,
    },
    {
      title: 'Cold Email Outreach Sequence — 5-Touch Campaign',
      slug: makeSlug('cold-email-outreach-sequence-5-touch'),
      description: 'Write a complete 5-email cold outreach sequence with personalized hooks, follow-ups, and a final breakup email.',
      content: `You are a B2B sales expert. Write a 5-email cold outreach sequence for:

**Your product/service:** [DESCRIPTION]
**Target prospect:** [JOB TITLE, COMPANY TYPE]
**Key pain point you solve:** [PROBLEM]
**Unique value prop:** [DIFFERENTIATOR]

Write each email:

**Email 1 — Initial Outreach (Day 1)**
- Subject: Pattern-interrupt, personalized
- Body: 3 sentences max. Lead with insight about THEIR business, not yours.
- CTA: One simple question

**Email 2 — Value Add (Day 3)**
- Share a relevant case study, stat, or insight
- No pitch

**Email 3 — Social Proof (Day 7)**
- One compelling result from a similar company
- Soft CTA

**Email 4 — Different Angle (Day 14)**
- Try a completely different value proposition
- Ask if they're the right person

**Email 5 — Breakup Email (Day 21)**
- Honest, respectful close
- Leave door open

Rules: No buzzwords. No "I hope this email finds you well." Max 100 words each.`,
      aiTool: 'chatgpt',
      generationType: 'text',
      category: 'business',
      tags: ['cold email', 'B2B sales', 'outreach', 'sales sequence'],
      resultText: `**Email 1 — Day 1**
Subject: [Company]'s churn rate

Hi Marcus,

Noticed [Company] recently expanded into 3 new markets — congrats. Fast growth usually means customer success starts breaking down around the 500-user mark.

We helped Notion reduce churn by 23% during a similar phase in 6 weeks.

Worth a 15-minute call this week?

---

**Email 5 — Breakup (Day 21)**
Subject: Closing the loop

Hi Marcus,

I'll stop following up after this. If solving [pain point] ever becomes a priority, I'm at [email].

Rooting for [Company] either way.

— [Name]`,
      likeCount: 445, copyCount: 312, viewCount: 4980, commentCount: 47, bookmarkCount: 128, trendingScore: 356,
      isFeatured: true,
    },
    {
      title: 'LinkedIn Thought Leadership Post Generator',
      slug: makeSlug('linkedin-thought-leadership-post-generator'),
      description: 'Create viral LinkedIn posts with proven hook formulas, personal story structure, and engagement-driving CTAs.',
      content: `You are a LinkedIn content strategist who has grown accounts to 50K+ followers. Write a viral LinkedIn post about [TOPIC].

**My background:** [YOUR ROLE/EXPERIENCE]
**Core insight to share:** [MAIN LESSON OR OPINION]
**Target audience:** [WHO SHOULD SEE THIS]
**Post format:** [STORY / LIST / HOT TAKE / FRAMEWORK]

LinkedIn post formula:

**Line 1 (Hook):** Must stop the scroll. Use one of:
- Counterintuitive statement
- Bold personal failure
- Surprising statistic
- Strong opinion

**Lines 2-8 (Body):**
- One idea per line
- White space after every 1-2 lines
- Build tension toward the insight
- Add specific numbers and names

**Final 3 lines (Payoff):**
- The core lesson
- Universal takeaway
- Question to drive comments

Keep under 1,300 characters for full display. No hashtag spam (max 3).`,
      aiTool: 'claude',
      generationType: 'text',
      category: 'productivity',
      tags: ['LinkedIn', 'personal branding', 'thought leadership', 'social media'],
      resultText: `I got laid off on a Tuesday.

By Friday, I had 3 job offers.

Here's the uncomfortable truth I learned:

Nobody cared about my resume.

They cared about my LinkedIn posts.

For 6 months, I'd been sharing weekly lessons from my work.
Just 3-4 posts. No growth hacks. No viral tactics.

Just real insights from real problems.

When I announced I was "open to work" —
47 people I'd never met sent me opportunities.

Your reputation isn't built when you need a job.
It's built when you don't.

Post consistently for 90 days. See what happens.

→ What's the one insight from your work that others would pay to learn?`,
      likeCount: 678, copyCount: 489, viewCount: 7890, commentCount: 94, bookmarkCount: 234, trendingScore: 534,
      isFeatured: true,
    },
    {
      title: 'Product Description Writer — E-commerce Conversion',
      slug: makeSlug('product-description-writer-ecommerce'),
      description: 'Write persuasive product descriptions that highlight benefits over features and overcome objections to boost conversions.',
      content: `You are an e-commerce conversion specialist. Write compelling product descriptions for:

**Product:** [PRODUCT NAME]
**Category:** [CATEGORY]
**Price point:** [PRICE]
**Target buyer:** [PERSONA: age, pain point, desire]
**Top 3 features:** [LIST]
**Main objection buyers have:** [OBJECTION]

Deliver:

**1. Headline (A/B test — 2 versions):**
Benefit-driven, emotionally resonant

**2. Short Description (50 words):**
Lead with the biggest benefit. Use sensory language.

**3. Full Description (200 words):**
- Open with the customer's desire/pain
- Bridge to your product as the solution
- Feature → Benefit translation (3 pairs)
- Overcome the main objection
- Close with confidence/guarantee

**4. Bullet Points (5):**
Format: [Feature] — [Benefit so you can ___]

**5. SEO Keywords (5 to include naturally)**

Avoid: "high quality," "best in class," vague claims without proof.`,
      aiTool: 'chatgpt',
      generationType: 'text',
      category: 'business',
      tags: ['product description', 'e-commerce', 'copywriting', 'conversion'],
      resultText: `**Headline A:** Wake Up Without Back Pain — The Mattress That Adapts to You
**Headline B:** The Last Mattress You'll Ever Buy (Your Spine Will Thank You)

**Short Description:**
CloudRest uses NASA-developed memory foam to map your body's exact pressure points. Zero partner disturbance. Wake up feeling like you actually slept.

**Full Description:**
You've tried everything. The $200 foam mattress that turned into a hammock. The "orthopedic" one that felt like concrete. You deserve sleep that actually works.

CloudRest's 7-layer system does what others don't: it changes firmness as you move. Side sleeper? It cushions. Back sleeper? It supports. Every layer serves a purpose.

Still skeptical? We offer a 100-night sleep trial. If you don't sleep better, we'll collect it. Free.

**Bullets:**
- Dual-zone temperature regulation — so you can stop fighting over the thermostat
- Zero-motion transfer — so your partner's 3AM trips don't wake you`,
      likeCount: 312, copyCount: 234, viewCount: 3560, commentCount: 27, bookmarkCount: 84, trendingScore: 238,
    },
    {
      title: 'Personal Development Coach — 90-Day Growth Plan',
      slug: makeSlug('personal-development-coach-90-day-plan'),
      description: 'Create a personalized 90-day growth plan with habit stacks, weekly milestones, and accountability frameworks.',
      content: `You are a world-class life and executive coach. Create a personalized 90-day development plan for:

**Goal:** [WHAT YOU WANT TO ACHIEVE]
**Current situation:** [WHERE YOU ARE NOW]
**Biggest obstacle:** [WHAT HOLDS YOU BACK]
**Available time:** [HOURS PER DAY/WEEK]
**Accountability style:** [SELF-DIRECTED / NEED STRUCTURE]

Deliver:

## 1. Goal Audit
- Is this goal specific, measurable, and meaningful?
- What does success look like on Day 91?
- Reframe: What you're gaining vs. giving up

## 2. Root Cause Analysis
- Why haven't you achieved this yet? (5 Whys method)
- Identify the ONE real obstacle

## 3. 90-Day Roadmap
**Days 1-30 (Foundation):** Daily micro-habits (≤15 min each)
**Days 31-60 (Build):** Weekly milestones + skill building
**Days 61-90 (Accelerate):** Systems + stretch challenges

## 4. Daily Habit Stack
Morning / Work / Evening rituals (specific times)

## 5. Weekly Review Template
5 questions to ask every Sunday

## 6. When You Fall Off Track
Exact script for getting back on track without guilt`,
      aiTool: 'claude',
      generationType: 'text',
      category: 'education',
      tags: ['personal development', 'habits', 'goal setting', 'productivity', 'coaching'],
      resultText: `## Goal Audit — "Write and publish my first book"

**Day 91 success:** 50,000-word first draft complete, shared with 3 beta readers.

## Root Cause (5 Whys)
1. Why haven't you written? → "No time"
2. Why no time? → "Work takes evenings"
3. Why evenings? → "Not protecting mornings"
4. Why? → "No hard start time for writing"
5. **Root cause:** No protected writing block = always optional

## 30-Day Foundation
- 6:00-6:30 AM: Write 300 words (non-negotiable)
- No editing. No re-reading. Just output.
- Track: words written, not time spent

## Daily Habit Stack
6:00 Wake → make coffee (no phone)
6:05-6:35 Write 300 words
6:35 Log word count in Notion

**Weekly Review Question #1:** Did I write every day? If no — what specifically interfered?`,
      likeCount: 267, copyCount: 198, viewCount: 2980, commentCount: 31, bookmarkCount: 78, trendingScore: 204,
    },

    // ═══════════════════════════════════════════════════════
    // IMAGE — 10 prompts
    // ═══════════════════════════════════════════════════════
    {
      title: 'Midjourney Product Photography — Commercial Studio',
      slug: makeSlug('midjourney-product-photography-commercial-studio'),
      description: 'Create stunning professional product photos with perfect studio lighting using this battle-tested Midjourney template.',
      content: `/imagine prompt: [PRODUCT] product photography, studio lighting, shot on Canon EOS R5, 85mm lens, f/2.8, [COLOR] background, ultra-sharp, 8K, clean minimal composition, [MOOD] aesthetic, soft shadow, photorealistic --ar [RATIO] --v 6 --style raw --q 2

**Fill in the variables:**
- [PRODUCT]: exact product (e.g., "glass perfume bottle", "leather wallet", "protein powder tub")
- [COLOR]: background color (e.g., "pure white", "soft cream", "matte black")
- [MOOD]: luxurious / minimalist / vibrant / rustic / tech-forward
- [RATIO]: 1:1 for social, 4:3 for web, 2:3 for portrait

**Power Tips:**
- Add "--no text, watermark, logo" to keep it clean
- Use "--seed 12345" to reproduce similar results
- For multiple angles: add "360 product view" to prompt
- For floating effect: add "levitating, floating in air"

**Ready-to-use examples:**
- Skincare: glass serum bottle, pearl white bg, luxurious --ar 2:3
- Sneakers: white sneaker on gray surface, dramatic side lighting --ar 4:3
- Coffee: ceramic mug with steam, dark moody background --ar 1:1
- Watch: luxury watch on marble surface, golden accent lighting --ar 1:1`,
      aiTool: 'midjourney',
      generationType: 'image',
      category: 'photo',
      tags: ['product photography', 'commercial', 'e-commerce', 'midjourney', 'studio'],
      resultText: `Example prompt used:
/imagine prompt: glass perfume bottle product photography, studio lighting, shot on Canon EOS R5, pearl white background, ultra-sharp, 8K, luxurious aesthetic, soft shadow, photorealistic --ar 2:3 --v 6 --style raw --q 2

Result: Professional perfume bottle photo with soft gradient shadow, glass refractions rendered beautifully. Light wraps around the bottle creating a premium look. Background gradient from white to pale ivory adds depth. Suitable for luxury brand campaigns.`,
      resultLink: 'https://www.midjourney.com',
      likeCount: 523, copyCount: 412, viewCount: 6240, commentCount: 58, bookmarkCount: 156, trendingScore: 412,
      isFeatured: true,
    },
    {
      title: 'Fantasy Character Illustration — Epic RPG Art',
      slug: makeSlug('fantasy-character-illustration-epic-rpg'),
      description: 'Create detailed fantasy character concept art with consistent style, dynamic poses, and rich storytelling environment.',
      content: `Create a fantasy character illustration for Midjourney or DALL-E:

**Character:**
- Class: [WARRIOR / MAGE / ROGUE / RANGER / PALADIN]
- Gender: [MALE / FEMALE / NON-BINARY]
- Age: [YOUNG / ADULT / ELDER]
- Distinctive feature: [SCARS / TATTOOS / GLOWING EYES / etc.]

**Visual Style:**
- Art style: [Digital painting / Concept art / Anime / Oil painting]
- Lighting: [Golden hour / Moonlight / Dungeon torchlight / Magical glow]
- Color palette: [WARM / COOL / MONOCHROME / HIGH CONTRAST]

**Equipment:**
- Armor: [DESCRIPTION]
- Weapon: [TYPE + MATERIAL]
- Accessories: [ITEMS]

**Composition:**
- Shot: [FULL BODY / HALF BODY / PORTRAIT]
- Background: [EPIC LANDSCAPE / RUINS / THRONE ROOM / FOREST]
- Pose: [COMBAT STANCE / RESTING / CASTING SPELL]

**Midjourney prompt format:**
/imagine prompt: [character description], [art style], [lighting], highly detailed character design, epic fantasy art, award-winning illustration, cinematic, 8K --ar 2:3 --v 6 --q 2`,
      aiTool: 'midjourney',
      generationType: 'image',
      category: 'illustration',
      tags: ['fantasy', 'character design', 'concept art', 'RPG', 'illustration'],
      resultText: `/imagine prompt: female elven archmage, silver hair with constellation patterns, wearing dark celestial robes with glowing blue runes, holding a staff topped with a captured star, ancient library background with floating books, digital painting concept art, cool moonlight from above, full body dramatic stance, highly detailed, cinematic composition, 8K --ar 2:3 --v 6 --q 2

Result: The silver-haired mage stands amidst a floating library, robes swirling with galactic patterns. The staff's starlight illuminates her determined expression. Each rune on her outfit tells a micro-story. Background depth creates a sense of infinite magical knowledge. Perfect for book covers, game character sheets, or print art.`,
      likeCount: 456, copyCount: 334, viewCount: 5120, commentCount: 48, bookmarkCount: 134, trendingScore: 348,
      isFeatured: true,
    },
    {
      title: 'Stable Diffusion Anime Portrait — SDXL Optimized',
      slug: makeSlug('stable-diffusion-anime-portrait-sdxl'),
      description: 'Generate high-quality anime portraits with optimized positive/negative prompts for Stable Diffusion SDXL and A1111.',
      content: `**Positive Prompt (customize the brackets):**
(masterpiece, best quality, ultra-detailed:1.3), 1girl, [AGE] years old, [HAIR COLOR] [HAIR STYLE] hair, [EYE COLOR] eyes, [EXPRESSION], wearing [OUTFIT], [BACKGROUND/SETTING], anime style, beautiful detailed face, soft lighting, cinematic composition, (8k wallpaper:1.2)

**Negative Prompt (use as-is):**
(worst quality, low quality:1.4), deformed, ugly, blurry, bad anatomy, extra limbs, watermark, text, (bad hands:1.3), (mutated hands:1.2), jpeg artifacts, out of frame

**Recommended Settings (A1111):**
- Model: Anything V5 / CounterfeitXL / Dreamshaper XL
- Sampler: DPM++ 2M Karras
- Steps: 28-35
- CFG Scale: 7
- Resolution: 768×1024 (portrait)
- Clip skip: 2

**Useful LoRAs:**
- <lora:add_detail:0.8> — sharper facial features
- <lora:epiNoiseoffset:0.6> — better lighting contrast

**Quick examples:**
- School setting: "17yo, brown bob hair, amber eyes, school uniform, cherry blossom garden"
- Fantasy: "elf princess, white long hair, violet eyes, golden crown, forest throne"
- Cyberpunk: "punk girl, neon pink hair, cyber implants, rain-soaked neon city"`,
      aiTool: 'stable-diffusion',
      generationType: 'image',
      category: 'art',
      tags: ['anime', 'stable diffusion', 'SDXL', 'portrait', 'A1111'],
      resultText: `Example output using school setting parameters:

Positive: (masterpiece, best quality:1.3), 1girl, 17 years old, brown bob hair, warm amber eyes, gentle smile, wearing sailor school uniform with red ribbon, autumn park with golden leaves falling, anime style, beautiful detailed face, golden hour lighting, 8k wallpaper

Result quality notes:
- CFG 7 produces natural skin tones without oversaturation
- DPM++ 2M Karras at 30 steps gives best detail-to-speed ratio
- Add <lora:add_detail:0.8> for sharper eye reflections
- Seed recorded: 2847563910 for reproduction

The autumn lighting adds warmth to the uniform's navy blue, creating a nostalgic school memory aesthetic popular in slice-of-life anime.`,
      likeCount: 389, copyCount: 287, viewCount: 4230, commentCount: 41, bookmarkCount: 108, trendingScore: 298,
    },
    {
      title: 'Interior Design Visualization — Room Makeover',
      slug: makeSlug('interior-design-visualization-room-makeover'),
      description: 'Generate photorealistic interior design renders for any room style using Midjourney with customizable mood and palette.',
      content: `/imagine prompt: [ROOM TYPE] interior design, [STYLE] style, [LIGHTING TYPE], [COLOR PALETTE] color palette, [TIME OF DAY], architectural photography, professional interior design, 8K photorealistic, wide angle lens, --ar 16:9 --v 6 --style raw

**Variables:**
- [ROOM TYPE]: living room / bedroom / kitchen / home office / bathroom
- [STYLE]: Japandi / Scandinavian / Industrial / Mid-century modern / Coastal / Maximalist / Wabi-sabi
- [LIGHTING]: natural sunlight / warm evening lamps / floor-to-ceiling windows / skylight
- [COLOR PALETTE]: warm neutrals / cool grays / earthy tones / bold jewel tones / all-white

**Style-specific additions:**
Japandi: "minimalist, natural wood, muted tones, negative space, linen textiles"
Industrial: "exposed brick, steel beams, Edison bulbs, concrete floors, leather"
Coastal: "whitewash wood, sea glass colors, rattan furniture, linen curtains"
Mid-century: "walnut furniture, mustard yellow, organic curves, statement lamp"

**Pro tip:** Add "vignette, depth of field" for magazine-quality renders
**Staging tip:** Include "styled coffee table books, fresh flowers, cashmere throw" for lived-in feel`,
      aiTool: 'midjourney',
      generationType: 'image',
      category: 'design',
      tags: ['interior design', 'architecture', 'home decor', 'visualization', 'midjourney'],
      resultText: `/imagine prompt: living room interior design, Japandi style, natural sunlight through floor-to-ceiling windows, warm neutrals color palette, morning light, architectural photography, professional interior design, 8K photorealistic, wide angle lens --ar 16:9 --v 6 --style raw

Result: A serene Japandi living room with low-profile walnut sofa, cream linen cushions, and a single sculptural ceramic vase. Morning sunlight creates long shadows on the concrete floor. A bonsai tree by the window anchors the space. The palette — warm white, ash wood, charcoal — creates meditative calm. Magazine-ready composition with natural depth of field.

Client feedback simulation: "This is exactly what I wanted to show my architect. The spatial scale is accurate enough for a real brief."`,
      likeCount: 334, copyCount: 256, viewCount: 3780, commentCount: 36, bookmarkCount: 98, trendingScore: 258,
    },
    {
      title: 'Logo & Brand Identity Generator — DALL-E',
      slug: makeSlug('logo-brand-identity-generator-dalle'),
      description: 'Create professional logo concepts and brand identity mockups with DALL-E 3 using proven design principles.',
      content: `Create a professional logo for my brand using DALL-E 3:

**Brand name:** [NAME]
**Industry:** [SECTOR]
**Brand personality:** [3 ADJECTIVES: e.g., bold, trustworthy, modern]
**Target audience:** [DEMOGRAPHIC]
**Color preference:** [OR "suggest based on industry"]

**Logo style options (pick one):**
- Wordmark: typography-only, custom lettering
- Lettermark: initials only (e.g., FedEx, IBM style)
- Icon + Wordmark: symbol alongside text
- Abstract mark: geometric or conceptual shape
- Mascot: character-based brand icon

**DALL-E 3 prompt template:**
"Minimalist [STYLE] logo for '[BRAND NAME]', a [INDUSTRY] company. [ADJECTIVE1], [ADJECTIVE2] aesthetic. [COLOR1] and [COLOR2] color palette. Clean vector-style, white background, professional, no gradients, scalable design."

**Brand identity request:**
After the logo, create:
1. Business card mockup using the logo
2. Brand color palette (hex codes)
3. Font pairing suggestion (heading + body)
4. Usage rules: minimum size, clear space`,
      aiTool: 'dalle',
      generationType: 'image',
      category: 'design',
      tags: ['logo', 'brand identity', 'DALL-E', 'branding', 'graphic design'],
      resultText: `Brand: "Verdant" — sustainable skincare company

DALL-E 3 prompt used:
"Minimalist icon + wordmark logo for 'Verdant', a sustainable skincare brand. Natural, clean, premium aesthetic. Forest green (#2D6A4F) and cream (#F5F0E8) color palette. Clean vector-style, white background, single leaf integrated into the 'V' letterform, professional, scalable."

Result: The 'V' letter incorporates a single botanical leaf that suggests both the initial and growth. Clean sans-serif wordmark in dark green below. The mark works at all sizes from favicon to billboard.

**Brand Identity:**
- Primary: Forest Green #2D6A4F
- Secondary: Warm Cream #F5F0E8
- Accent: Terracotta #C17C59
- Fonts: Canela (headlines) + Inter (body)
- Tagline direction: "Grown. Not made."`,
      likeCount: 298, copyCount: 223, viewCount: 3340, commentCount: 29, bookmarkCount: 87, trendingScore: 228,
    },
    {
      title: 'Cinematic Landscape Photography — Midjourney',
      slug: makeSlug('cinematic-landscape-photography-midjourney'),
      description: 'Generate breathtaking landscape and nature photography with cinematic quality, perfect golden hour lighting, and epic scale.',
      content: `/imagine prompt: [LANDSCAPE TYPE], [TIME OF DAY], [WEATHER/ATMOSPHERE], shot on [CAMERA] with [LENS], [PHOTOGRAPHY STYLE], epic scale, [COLOR GRADE], award-winning nature photography, National Geographic quality, 8K --ar 16:9 --v 6 --style raw

**Variable guide:**
- [LANDSCAPE]: mountain range / coastal cliffs / desert dunes / ancient forest / volcanic lake / aurora borealis / lavender fields
- [TIME]: golden hour / blue hour / sunrise / storm approaching / after rain
- [ATMOSPHERE]: morning mist / dramatic storm clouds / crystal clear / hazy distance / fire sky
- [CAMERA]: Sony A7R V / Canon R5 / Hasselblad / Phase One
- [LENS]: 16-35mm wide / 70-200mm telephoto / tilt-shift
- [STYLE]: long exposure / HDR / light painting / star trails
- [COLOR GRADE]: moody desaturated / warm golden / cool blue / vivid saturated

**Epic composition formulas:**
- Foreground interest + mid subject + dramatic sky (rule of thirds)
- Leading lines (river, road, fence) drawing eye to subject
- Reflection (still water doubling the scene)
- Scale reference (tiny human figure in vast landscape)`,
      aiTool: 'midjourney',
      generationType: 'image',
      category: 'photo',
      tags: ['landscape', 'nature photography', 'cinematic', 'golden hour', 'midjourney'],
      resultText: `/imagine prompt: Icelandic glacier lagoon at blue hour, icebergs floating with aurora borealis reflection, shot on Sony A7R V 16-35mm, long exposure 30s, cool blue and teal color grade, dramatic star-filled sky, award-winning nature photography, National Geographic quality, 8K --ar 16:9 --v 6 --style raw

Result: The glacier lagoon stretches into the distance, each iceberg uniquely shaped and glowing with reflected auroras. The 30-second exposure renders the water mirror-smooth, doubling the green curtains of aurora above. A lone figure on the shore gives scale to the cathedral-like icebergs. Voted "Best AI Landscape" in several Discord competitions.

Print-ready at 36" wide. Perfect for hotel lobbies, office feature walls, editorial use.`,
      likeCount: 412, copyCount: 312, viewCount: 4870, commentCount: 44, bookmarkCount: 124, trendingScore: 316,
      isFeatured: true,
    },
    {
      title: 'Food Photography Styling — Restaurant & Recipe',
      slug: makeSlug('food-photography-styling-restaurant-recipe'),
      description: 'Create mouth-watering food photography with perfect styling, lighting, and composition for any cuisine using Midjourney.',
      content: `/imagine prompt: [DISH NAME], food photography, [STYLING STYLE], [SURFACE/PROP], [LIGHTING], shallow depth of field, garnished with [GARNISH], styled by professional food photographer, appetizing, Michelin star presentation, 8K --ar [RATIO] --v 6 --style raw

**Variables:**
- [DISH]: be specific — "dark chocolate lava cake", "ramen with chashu pork", "burrata with heirloom tomatoes"
- [STYLE]: rustic / modern minimalist / fine dining / street food authentic / Nordic / Japanese kaiseki
- [SURFACE]: dark slate / white marble / weathered wood / linen napkin / copper tray
- [LIGHTING]: soft window light from left / dramatic side lighting / overhead flat lay / candlelight
- [GARNISH]: fresh herbs / microgreens / edible flowers / sauce drizzle / flaky sea salt / citrus zest

**Composition styles:**
- Hero shot: 45° angle, slight blur on background, hero ingredient in sharp focus
- Flat lay: 90° overhead, arranged symmetrically with props
- Close-up: macro detail of texture, steam, dripping sauce
- Scene setting: full table setup with hands, drinks, atmosphere

**Trending food aesthetics:**
- Dark & moody: deep shadows, dramatic contrast, editorial feel
- Bright & airy: white surfaces, fresh herbs, natural light
- Nostalgic: vintage plates, grandmother's kitchen, warm tones`,
      aiTool: 'midjourney',
      generationType: 'image',
      category: 'photo',
      tags: ['food photography', 'culinary', 'restaurant', 'recipe', 'styling'],
      resultText: `/imagine prompt: Japanese ramen bowl with chashu pork, soft-boiled egg, nori, bamboo shoots, food photography, dark and moody styling, dark slate surface with chopsticks resting on bowl edge, dramatic side lighting creating steam wisps, shallow depth of field, garnished with scallions and sesame seeds, professional food photographer, 8K --ar 4:3 --v 6 --style raw

Result: The dark slate surface makes the rich amber broth glow. Steam curls catch the side light dramatically. The soft-boiled egg is halved to reveal the jammy yolk — the money shot. Nori casts a subtle shadow. The composition draws the eye from the egg, along the chashu, to the steaming broth.

Used by: 3 ramen restaurant Instagram accounts as menu photography. One reported 40% increase in ramen orders after updating their profile.`,
      likeCount: 378, copyCount: 289, viewCount: 4230, commentCount: 39, bookmarkCount: 112, trendingScore: 289,
    },
    {
      title: 'UI/UX Dashboard Design — SaaS Visual Mockup',
      slug: makeSlug('ui-ux-dashboard-design-saas-visual'),
      description: 'Generate realistic SaaS dashboard and app UI mockups with DALL-E 3 for presentations, pitches, and design inspiration.',
      content: `Create a UI/UX dashboard mockup with DALL-E 3:

**Product type:** [ANALYTICS DASHBOARD / CRM / PROJECT MGMT / FINANCE APP / HEALTH APP]
**Design style:** [MODERN MINIMAL / DARK MODE / GLASSMORPHISM / BRUTALIST / CORPORATE]
**Color scheme:** [PRIMARY COLOR + DARK/LIGHT MODE]
**Key components to show:**
- [ ] Navigation sidebar
- [ ] KPI metric cards
- [ ] Charts (bar / line / donut)
- [ ] Data table
- [ ] User avatar and profile

**DALL-E 3 prompt:**
"Screenshot of a modern [PRODUCT] SaaS dashboard in [STYLE] style. [COLOR] primary color. Shows [COMPONENTS]. Clean UI design, professional, Figma quality, desktop 1440px wide layout, no dummy text, realistic data in charts, UI/UX award quality."

**Figma-style variation:**
Add "flat design, component library view, design system, 8pt grid" for design tool output

**Presentation tip:**
Ask for "MacBook mockup showing the dashboard" for pitch decks`,
      aiTool: 'dalle',
      generationType: 'image',
      category: 'design',
      tags: ['UI design', 'UX', 'dashboard', 'SaaS', 'mockup', 'app design'],
      resultText: `DALL-E 3 prompt used:
"Screenshot of a modern analytics SaaS dashboard in dark mode glassmorphism style. Purple and cyan primary colors. Shows: left navigation sidebar with icons, 4 KPI cards showing users/revenue/conversion/churn metrics with trend arrows, large line chart for monthly revenue, data table with user list, user avatar top right. Clean UI design, Figma quality, desktop 1440px, realistic numbers in charts."

Result: A sleek dark dashboard with frosted glass card effects. Purple gradient on active nav item. Cyan accent on positive trend indicators. The revenue chart shows realistic seasonal curves. Glassmorphism overlays create depth without visual noise.

Best use cases: investor pitch decks, product hunt landing pages, design portfolio pieces, client proposals. Multiple designers reported using this as a starting point for actual Figma work.`,
      likeCount: 445, copyCount: 356, viewCount: 5120, commentCount: 52, bookmarkCount: 134, trendingScore: 356,
      isFeatured: true,
    },
    {
      title: 'Abstract Digital Art — Generative AI Composition',
      slug: makeSlug('abstract-digital-art-generative-composition'),
      description: 'Create stunning abstract digital artworks with fluid dynamics, geometric patterns, and vibrant color harmonies.',
      content: `**Stable Diffusion / Midjourney Abstract Art Prompts:**

**Style 1 — Fluid Dynamics:**
/imagine prompt: abstract fluid art, [COLOR1] and [COLOR2] liquid flowing, macro photography style, [TEXTURE: marble swirls / oil on water / aurora patterns], hyperrealistic material, 8K detail, [MOOD] atmosphere --ar 1:1 --v 6

**Style 2 — Sacred Geometry:**
/imagine prompt: sacred geometry mandala, [STYLE: crystalline / neon / golden ratio], infinitely detailed, [COLOR PALETTE], fractal depth, mathematical beauty, professional digital art --ar 1:1 --v 6

**Style 3 — Glitch Art:**
/imagine prompt: glitch art, [SUBJECT] corrupted with digital artifacts, vaporwave color palette, scanlines, pixel sorting, [AESTHETIC: cyberpunk / retrowave / harajuku], high detail --ar 16:9 --v 6

**Style 4 — Organic Geometry:**
/imagine prompt: [NATURAL FORM: crystal growth / mycelium network / neural dendrites] abstract art, extreme macro, [METAL: gold / silver / iridescent], dark background, microscopy photography style, 8K --ar 1:1

**Color harmony recipes:**
- Electric: cyan + magenta + deep navy
- Organic: moss green + rust + cream
- Twilight: violet + coral + midnight blue
- Void: pure black + single neon accent`,
      aiTool: 'stable-diffusion',
      generationType: 'image',
      category: 'art',
      tags: ['abstract', 'digital art', 'generative', 'stable diffusion', 'fluid art'],
      resultText: `Example — Sacred Geometry style:
/imagine prompt: sacred geometry mandala, crystalline style, infinite recursive detail, amethyst purple and gold ratio spirals, fractal depth, glowing from within, mathematical beauty, professional digital art, 8K --ar 1:1 --v 6

Result: A mandala that appears to have no bottom — each ring opens into a smaller version of itself. The purple-to-gold gradient follows the Fibonacci spiral. Under zoom, each "petal" reveals microscopic geometric detail. Printed at 24"×24" for gallery show; drew the most foot traffic of any piece. Zero physical input — purely AI-generated, signed as a numbered edition of 10.

Print tips:
- Export at 4096×4096 minimum for large format
- Matte finish recommended (glossy can oversaturate purples)`,
      likeCount: 289, copyCount: 212, viewCount: 3240, commentCount: 31, bookmarkCount: 89, trendingScore: 222,
    },
    {
      title: 'AI Professional Headshot — LinkedIn & Profile Photo',
      slug: makeSlug('ai-professional-headshot-linkedin-profile'),
      description: 'Generate professional LinkedIn-ready headshots and profile photos with Midjourney using consistent lighting and style.',
      content: `/imagine prompt: professional headshot photo of [GENDER] [APPROXIMATE AGE], [ETHNICITY optional], [HAIR DESCRIPTION], [EXPRESSION: confident smile / serious / approachable], wearing [OUTFIT: navy suit / white shirt / business casual], [BACKGROUND: blurred office / neutral gray / gradient], studio photography, LinkedIn profile photo quality, Canon 85mm f/1.4, natural skin texture, corporate professional --ar 1:1 --v 6 --style raw

**Lighting setups:**
- Corporate: "three-point studio lighting, neutral background"
- Approachable: "soft natural window light from left, warm tone"
- Creative industry: "outdoor urban background, golden hour"
- Executive: "dramatic Rembrandt lighting, dark background"

**Background options:**
- Safest: "solid medium gray background, subtle gradient"
- Office feel: "blurred modern office interior, bokeh"
- Outdoors: "blurred city street, natural daylight"

**Style consistency tip:**
Use same seed + slight variation prompts to create a matching photo series:
"--seed [NUMBER] --chaos 5" for consistent look across multiple shots

**For teams:**
Create uniform headshots by using same lighting/background parameters for all team members`,
      aiTool: 'midjourney',
      generationType: 'image',
      category: 'photo',
      tags: ['headshot', 'LinkedIn', 'professional photo', 'portrait', 'profile photo'],
      resultText: `/imagine prompt: professional headshot photo of woman, early 30s, dark shoulder-length hair, confident warm smile, wearing white button-up blouse, blurred modern office background with soft bokeh, studio photography, LinkedIn profile quality, Canon 85mm f/1.4, natural skin texture, corporate professional --ar 1:1 --v 6 --style raw

Result: Clean, natural-looking professional headshot with creamy bokeh background. The smile reads as genuinely confident rather than forced. Skin tones are accurate without smoothing. Eye catchlights add life to the portrait. Hair strands rendered naturally.

Real-world use: 3 users reported replacing their actual LinkedIn photo with this output after colleagues couldn't tell it was AI-generated. Works best for team page mockups and prototype pitch decks.`,
      likeCount: 534, copyCount: 423, viewCount: 6120, commentCount: 67, bookmarkCount: 178, trendingScore: 434,
      isFeatured: true,
    },

    // ═══════════════════════════════════════════════════════
    // VIDEO — 10 prompts
    // ═══════════════════════════════════════════════════════
    {
      title: 'YouTube Video Script Writer — Hook to CTA',
      slug: makeSlug('youtube-video-script-hook-to-cta'),
      description: 'Write engaging YouTube scripts with proven hook formulas, retention tactics, and channel-growth CTA strategy.',
      content: `You are a YouTube scriptwriter for channels with 1M+ subscribers. Write a complete script for:

**Topic:** [VIDEO TOPIC]
**Niche:** [CHANNEL NICHE]
**Audience:** [DEMOGRAPHIC]
**Length:** [5 / 10 / 15 / 20 min]
**Tone:** [EDUCATIONAL / ENTERTAINING / CONTROVERSIAL]
**Goal:** [VIEWS / SUBSCRIBERS / SALES]

Write:

### 1. Title Options (5 variations)
Use these formulas:
- "I Did X for Y Days — Here's What Happened"
- "Why [BELIEF] Is Wrong (And What to Do Instead)"
- "The [N] [Topic] Mistakes That Are Killing Your [Goal]"

### 2. Thumbnail Concept
Text (3 words max) + visual elements + color scheme

### 3. Full Script

**[HOOK 0:00-0:30]**
Most compelling statement or question. Tease the payoff without revealing it.

**[INTRO 0:30-1:30]**
Credibility + video roadmap

**[MAIN CONTENT]**
3-5 sections with timestamps. Pattern interrupt every 60-90 seconds. B-roll in [brackets]. Retention hook at 30%, 60%, 90%.

**[CTA — last 60 sec]**
Specific ask + reason + value they get

### 4. SEO Description Template`,
      aiTool: 'chatgpt',
      generationType: 'video',
      category: 'script',
      tags: ['YouTube', 'script', 'hook', 'content creator', 'retention'],
      resultText: `**Title (winner):** "Why Your YouTube Videos Get 0 Views (The Algorithm Nobody Explains)"

**Thumbnail:** Text: "0 VIEWS WHY" | Face with shocked expression | Red background

---

**[HOOK 0:00-0:20]**
"This video could save your YouTube channel. Or prove why it's already dying. [pause] 94% of new creators make this mistake in their first 100 videos. I made it for 2 years. Let me show you exactly what it looks like — starting with your last video."

**[INTRO 0:20-1:00]**
"I've analyzed 500 viral videos across 12 niches. I found a pattern so obvious that once you see it, you can't unsee it. 3 rules. By the end, you'll know why your retention drops at the 30-second mark."

**[SECTION 1 — 1:00-4:30]**
"Rule #1: The Hook Creates a Knowledge Gap.
[B-roll: audience retention graph dropping at 0:30]
The average viewer decides in 8 seconds. Here's what the data says works — and it's the opposite of what most creators do..."

**[CTA]**
"If this helped, subscribe. I post the data most creators won't share. And watch this video next — it covers exactly how to fix your retention graph."`,
      likeCount: 567, copyCount: 423, viewCount: 6780, commentCount: 72, bookmarkCount: 189, trendingScore: 456,
      isFeatured: true,
    },
    {
      title: 'TikTok & Reels Hook Generator — Scroll-Stopping Openers',
      slug: makeSlug('tiktok-reels-hook-generator-scroll-stopping'),
      description: 'Generate 10 scroll-stopping hooks for TikTok and Instagram Reels with visual descriptions and trending sound suggestions.',
      content: `You are a viral short-form content strategist. Generate 10 hooks for TikTok/Reels about [TOPIC].

**Niche:** [YOUR NICHE]
**Content type:** [EDUCATIONAL / STORY / PRODUCT / ENTERTAINMENT]
**Target emotion:** [CURIOSITY / SHOCK / RELATABILITY / ASPIRATION / FOMO]

Generate hooks using each formula:

**1. The Lie Reveal:** "Everyone told me [ADVICE] was the key to [GOAL]. They were wrong."
**2. The Impossible Claim:** "I [ACHIEVED X] in [TIMEFRAME] using [METHOD]."
**3. POV Relatability:** "POV: You finally [SITUATION]. What happens next:"
**4. Unpopular Opinion:** "Hot take: [CONTRARIAN STATEMENT]."
**5. Before/After:** "[TIME] ago I had [PROBLEM]. Now [RESULT]. Here's the difference:"
**6. Question Hook:** "What do [AUDIENCE] never talk about? I'll show you."
**7. Number Hook:** "[N] things I wish I knew before [EXPERIENCE]."
**8. Warning Hook:** "Stop doing [COMMON THING] if you want [RESULT]."
**9. Story Hook:** "The day I [DRAMATIC EVENT] changed everything about how I [TOPIC]."
**10. Visual Hook:** (describes visual action in first 3 seconds)

For each hook, provide:
- First 3 seconds visual direction
- Text overlay copy
- Sound type recommendation
- Hook strength score (1-10)`,
      aiTool: 'chatgpt',
      generationType: 'video',
      category: 'social',
      tags: ['TikTok', 'Instagram Reels', 'hook', 'viral', 'short-form'],
      resultText: `**Niche: Personal Finance**

1. **Lie Reveal (9/10):** "Everyone told me to max my 401k first. My financial advisor was wrong."
→ Visual: Shred a 401k statement dramatically
→ Text overlay: "THEY LIED TO YOU"
→ Sound: Dramatic bass drop

2. **Impossible Claim (8/10):** "I paid off $67,000 of debt in 18 months on a $52k salary. Here's how:"
→ Visual: Show a debt payoff tracker at $0
→ Text: "$67K GONE"
→ Sound: Celebration/victory trending audio

3. **POV (10/10):** "POV: You finally open your credit card statement"
→ Visual: Exaggerated horrified face looking at phone
→ Text: "THE MOMENT YOU REGRET EVERYTHING"
→ Sound: Suspenseful "oh no" trending audio

5. **Before/After (9/10):** "2 years ago I had $0 in savings. Now I have 8 months emergency fund. The one habit that changed it:"
→ Visual: Old bank balance vs current balance screenshots
→ Sound: Transformational/glow-up audio`,
      likeCount: 645, copyCount: 512, viewCount: 7890, commentCount: 89, bookmarkCount: 223, trendingScore: 534,
      isFeatured: true,
    },
    {
      title: 'Video Ad Script — 30 & 60 Second Commercial',
      slug: makeSlug('video-ad-script-30-60-second-commercial'),
      description: 'Write high-converting video ad scripts for YouTube, Facebook, and Instagram with proven problem-solution-CTA structure.',
      content: `You are a direct response video advertising expert. Write a 30-second AND 60-second ad script for:

**Product/Service:** [NAME]
**Core promise:** [TRANSFORMATION YOU OFFER]
**Target audience:** [DEMOGRAPHICS + PSYCHOGRAPHICS]
**Platform:** [YouTube / Facebook / Instagram / TikTok]
**Budget feel:** [PREMIUM / AUTHENTIC / UGC-STYLE]

Write both versions:

**30-Second Script:**
- 0:00-0:05: Pattern interrupt (stop the scroll)
- 0:05-0:15: Problem agitation (make them feel the pain)
- 0:15-0:25: Solution reveal + key benefit
- 0:25-0:30: CTA with urgency

**60-Second Script:**
- 0:00-0:05: Hook
- 0:05-0:20: Deeper problem story
- 0:20-0:40: Solution + 3 proof points (testimonial/stats/demo)
- 0:40-0:55: Overcome main objection
- 0:55-1:00: CTA

Include for each:
- Voiceover (VO) text
- On-screen visual directions
- Text overlay suggestions
- Emotion to evoke at each moment`,
      aiTool: 'claude',
      generationType: 'video',
      category: 'social',
      tags: ['video ad', 'commercial', 'Facebook ads', 'YouTube ads', 'direct response'],
      resultText: `**Product: Sleep tracking app "DreamOS"**

**30-Second Script:**

0:00-0:05 [VO]: "You're not tired because you're busy."
[Visual: Close-up of person staring at ceiling at 2AM, phone light on face]
[Text overlay: "You're tired because your sleep is broken."]

0:05-0:15 [VO]: "Most people get 7 hours but only 90 minutes of deep sleep."
[Visual: Sleep graph showing almost no deep sleep phases]

0:15-0:25 [VO]: "DreamOS identifies exactly what's disrupting your rest — and fixes it in 14 days."
[Visual: App UI showing sleep stages improving night-over-night]

0:25-0:30 [VO]: "Try it free for 30 nights."
[Visual: App download screen]
[Text: "30-Night Sleep Guarantee"]

---

**Hook testing notes:**
Version A: Start with "You're not tired because you're busy" (curiosity)
Version B: Start with person slamming snooze button (relatability)
Version B typically wins by 15-20% CTR in A/B tests for sleep apps.`,
      likeCount: 312, copyCount: 245, viewCount: 3560, commentCount: 31, bookmarkCount: 89, trendingScore: 242,
    },
    {
      title: 'Explainer Video Script — 90-Second Product Demo',
      slug: makeSlug('explainer-video-script-90-second-product-demo'),
      description: 'Write a clear, engaging 90-second explainer video script that turns complex products into "aha moment" pitches.',
      content: `You are an explainer video specialist. Write a 90-second script for:

**Product/Service:** [NAME]
**What it does:** [ONE SENTENCE]
**Core audience problem:** [THE PAIN]
**How it solves it:** [THE MECHANISM]
**Key differentiator:** [WHY DIFFERENT]

**Explainer Video Formula (90 sec = ~240 words):**

**[ACT 1 — The Problem (0:00-0:25)]**
Show the customer in pain. Use empathy. Make them say "that's me."
Avoid: statistics, company history, product features.

**[ACT 2 — The Solution (0:25-0:55)]**
Introduce your product as the hero. Show, don't tell.
One clear explanation of HOW it works (the mechanism).
Use an analogy if the concept is abstract.

**[ACT 3 — The Proof (0:55-1:15)]**
3 key benefits (not features). Frame as outcomes:
"So you can ___" not "It has ___"

**[ACT 4 — The CTA (1:15-1:30)]**
One action. One reason. One urgency.

**Animation style direction:**
[2D FLAT / MOTION GRAPHICS / WHITEBOARD / CHARACTER ANIMATION]
Color palette + tone notes for animator`,
      aiTool: 'claude',
      generationType: 'video',
      category: 'script',
      tags: ['explainer video', 'product demo', 'startup', 'SaaS', 'animation'],
      resultText: `**Product: "Clerk" — AI meeting notes tool**

[0:00-0:25 | THE PROBLEM]
VO: "You spend 6 hours in meetings every week. Then spend another 3 hours writing up what happened."
[Animation: Calendar packed with meetings. Person at laptop, frustrated, rewinding recording]
VO: "And by Thursday, you can't remember who said what or what anyone agreed to do."

[0:25-0:55 | THE SOLUTION]
VO: "Clerk joins your call, listens, and builds your meeting notes in real time."
[Animation: Friendly robot icon entering a video call. Notes appearing live as people speak]
VO: "Action items, decisions, open questions — all organized and sent to your team before the call ends."

[0:55-1:15 | THE PROOF]
VO: "So you can actually be present in meetings."
"So nothing falls through the cracks."
"So Fridays are for work, not catch-up."
[Animation: Person leaning back, relaxed. Clean notes document. Team high-fiving]

[1:15-1:30 | CTA]
VO: "Try Clerk free for 14 days. Your next meeting can be your last set of manual notes."
[Screen: Large CTA button. Logo. Simple URL]`,
      likeCount: 267, copyCount: 198, viewCount: 3120, commentCount: 24, bookmarkCount: 78, trendingScore: 208,
    },
    {
      title: 'Podcast Episode Outline & Talking Points',
      slug: makeSlug('podcast-episode-outline-talking-points'),
      description: 'Create a complete podcast episode outline with hook, interview questions, storytelling beats, and memorable soundbites.',
      content: `You are a podcast producer for top-100 shows. Create a complete episode plan for:

**Show name:** [NAME]
**Episode topic:** [TOPIC]
**Format:** [SOLO / INTERVIEW / PANEL]
**Length:** [20 / 45 / 60 minutes]
**Target listener:** [WHO LISTENS AND WHY]

Deliver:

**1. Episode Hook (opening 60 seconds)**
- Teaser quote or shocking statement
- What listener will take away

**2. Show Notes Description (150 words)**
For Spotify/Apple Podcasts listing

**3. Interview Questions (if applicable)**
- 3 warm-up questions
- 5 core questions (with follow-up prompts)
- 2 "lightning round" questions
- 1 closing question

**4. Episode Structure (with timestamps)**
- Opening hook
- Guest/topic intro
- Act 1, 2, 3 beats
- Key turning point moments
- Closing takeaway

**5. Soundbite Moments (5)**
Lines designed to be clipped for social media

**6. Episode Title Options (5)**
Optimized for search + curiosity

**7. Social Media Clip Descriptions**
Which moments to clip + why they'll perform`,
      aiTool: 'chatgpt',
      generationType: 'video',
      category: 'script',
      tags: ['podcast', 'script', 'interview', 'content creation', 'show notes'],
      resultText: `**Episode: "How a Burned-Out Engineer Built a $4M Bootstrapped SaaS" with Sarah Chen**

**Opening Hook:**
"In 2021, Sarah Chen was on medical leave from Google — burnout so bad she couldn't read emails. 18 months later, she had $4 million in ARR. This is the story she's never told publicly."

**Core Interview Questions:**
1. "Take me to the exact moment you knew you had to leave Google. What was happening?"
2. "You built the first version in 3 weeks — what were you *not* building that most founders would have built?"
3. "You hit $1M ARR before hiring anyone. What breaks at that scale that people don't warn you about?"
4. "You've said pricing was your biggest mistake early on. What did you get wrong and how did you fix it?"
5. "If you had to start over today, with everything you know, what's the first thing you'd do differently?"

**Soundbite moments:**
→ 18:30 "I stopped trying to build a startup and started trying to solve one problem for one person."
→ 31:15 "Your first 100 customers are not your target market. They're your R&D department."`,
      likeCount: 234, copyCount: 178, viewCount: 2780, commentCount: 27, bookmarkCount: 72, trendingScore: 188,
    },
    {
      title: 'Documentary-Style Narration Writer',
      slug: makeSlug('documentary-style-narration-writer'),
      description: 'Write compelling documentary narration scripts with cinematic storytelling, expert tone, and emotional journey arcs.',
      content: `You are a documentary filmmaker and writer. Write narration for a documentary segment about:

**Topic:** [SUBJECT]
**Tone:** [INVESTIGATIVE / INSPIRING / SOMBER / HOPEFUL / URGENT]
**Length:** [2-minute / 5-minute / feature segment]
**Style inspiration:** [Netflix / BBC / National Geographic / Vice / Ken Burns]

Write:

**1. Opening Narration (30 seconds)**
Begin in medias res — no "this is a story about." Drop audience directly into the world.

**2. Act Structure**

*Setup (establish world and stakes):*
- Introduce the central tension in first 90 seconds
- No exposition dumps — weave facts into story

*Rising action (complicate and deepen):*
- Counterintuitive insight that reframes the story
- Specific human detail (a name, a place, a date)

*Climax (the turning point):*
- The moment everything changes

*Resolution (what it means):*
- Larger implication beyond the specific story
- What the audience should feel/think/do

**3. Interview Question Suggestions**
5 questions designed to extract emotional soundbites

**4. Visual Suggestions**
B-roll recommendations for each narration beat

**5. Music Direction**
Emotional arc mapped to music style`,
      aiTool: 'claude',
      generationType: 'video',
      category: 'script',
      tags: ['documentary', 'narration', 'storytelling', 'filmmaking', 'script'],
      resultText: `**Topic: The Last Coral Reef Seedbank**

**Opening Narration:**
"In a basement laboratory in Townsville, Australia, Dr. Mia Hoegh-Guldberg keeps the future in a freezer. Inside: 800 species of coral. The last complete genetic library of the Great Barrier Reef. It cost $40 million and took 12 years to build. She hopes she never has to use it."

**Rising Action:**
"In 1998, the reef bleached for the first time in recorded history. Scientists called it an anomaly. In 2016, it happened again — 50% of the reef in a single summer. In 2024, for the fifth time in eight years, the ocean temperature crossed the threshold. The anomaly had become the baseline.

But in Mia's freezer, 2 degrees Celsius below zero, the coral doesn't know any of this. It's simply waiting."

**Interview question (designed for emotional soundbite):**
"When you imagine your grandchildren asking you about the Great Barrier Reef — what do you want to be able to tell them you did?"`,
      likeCount: 189, copyCount: 134, viewCount: 2340, commentCount: 19, bookmarkCount: 58, trendingScore: 152,
    },
    {
      title: 'Animation Storyboard & Scene Description',
      slug: makeSlug('animation-storyboard-scene-description'),
      description: 'Generate detailed animation storyboards and scene-by-scene breakdowns for explainer videos, short films, and motion graphics.',
      content: `You are an animation director. Create a complete storyboard breakdown for:

**Project type:** [EXPLAINER / SHORT FILM / MUSIC VIDEO / AD / TITLE SEQUENCE]
**Animation style:** [2D FLAT / 3D / STOP MOTION / WHITEBOARD / MOTION GRAPHICS / MIXED MEDIA]
**Duration:** [30 sec / 60 sec / 2 min / 5 min]
**Mood/Tone:** [PLAYFUL / SERIOUS / CINEMATIC / QUIRKY / EMOTIONAL]
**Color palette:** [DESCRIBE or say "suggest"]

For each scene, provide:

**Scene [N]: [DURATION]**
- Shot type: [WIDE / MEDIUM / CLOSE-UP / EXTREME CLOSE / POV]
- Camera movement: [STATIC / PAN / ZOOM IN/OUT / TRACKING / TILT]
- Characters: [WHO and WHAT THEY'RE DOING]
- Background: [DETAILED DESCRIPTION]
- Key animation: [WHAT MOVES and HOW]
- Color/Lighting: [DESCRIPTION]
- VO/SFX/Music: [AUDIO DIRECTION]
- Transition to next: [CUT / DISSOLVE / WIPE / MATCH CUT / MORPH]

Also provide:
- Overall visual metaphor/concept
- Character design brief (if applicable)
- Style reference (existing works)
- Technical notes for animator`,
      aiTool: 'chatgpt',
      generationType: 'video',
      category: 'animation',
      tags: ['animation', 'storyboard', 'motion graphics', 'explainer', 'filmmaking'],
      resultText: `**Project: Explainer for "Duolingo for Finance" — 60 seconds, 2D flat animation**

**Visual Concept:** Money concepts as friendly creatures — a piggy bank that's scared of credit cards, coins with faces, a mortgage that towers like a monster.

---

**Scene 1: 0:00-0:05**
- Shot: WIDE establishing shot
- Characters: Person sitting on pile of bills, overwhelmed
- Background: Gray office, bills raining from ceiling
- Key animation: Bills multiplying and falling, character shrinking
- Color: Muted gray, stressed reds
- Audio: Discordant background noise, no VO yet
- Transition: WHIP PAN to scene 2

**Scene 2: 0:05-0:12**
- Shot: MEDIUM on character's face
- VO: "Most of us were never taught how money actually works."
- Animation: Character looks at camera — breaks fourth wall
- Key moment: Slight nod, recognition — "that's me"
- Color shift: Slight warm undertone begins

**Scene 3 (THE TURN): 0:35-0:45**
- Shot: EXTREME WIDE, cosmic scale
- Character holding glowing "financial map"
- Animation: Map unfolds to reveal simple, clear paths
- Color: Full warm palette blooms — yellow, teal, warm white
- VO: "When money makes sense, everything else gets easier."`,
      likeCount: 223, copyCount: 167, viewCount: 2670, commentCount: 22, bookmarkCount: 67, trendingScore: 178,
    },
    {
      title: 'Short-Form Video Series Planner — Content Calendar',
      slug: makeSlug('short-form-video-series-planner-content-calendar'),
      description: 'Plan a 30-day short-form video content series with hooks, formats, and growth strategy for TikTok, Reels, or YouTube Shorts.',
      content: `You are a short-form content strategist. Plan a 30-day video series for:

**Creator type:** [BRAND / PERSONAL / EDUCATOR / ENTERTAINER]
**Platform:** [TikTok / Instagram Reels / YouTube Shorts / all three]
**Niche:** [YOUR TOPIC]
**Posting frequency:** [1x / 2x / 3x per day]
**Growth goal:** [FOLLOWERS / BRAND AWARENESS / LEADS / SALES]

Deliver:

## 1. Content Pillars (4 types to rotate)
Each pillar: name, format, purpose, example

## 2. 30-Day Content Calendar
For each video:
- Day and pillar type
- Hook (first line only)
- Format (talking head / text on screen / POV / tutorial / story)
- Trending audio direction
- Thumbnail/cover frame concept

## 3. Series Concepts (3 original series)
Running segments that create appointment viewing

## 4. Growth Accelerators
- Best posting times for your niche
- Hashtag strategy (3 tiers: niche / medium / large)
- Collaboration angles
- How to turn comments into new content

## 5. Week 1 Full Scripts
Complete scripts for first 7 videos`,
      aiTool: 'claude',
      generationType: 'video',
      category: 'social',
      tags: ['content calendar', 'TikTok', 'Reels', 'short-form', 'content strategy'],
      resultText: `**Creator: Financial educator, 2x/day posting, lead generation goal**

## Content Pillars
1. **Myth Busting** — "The lie your bank told you" — builds trust and virality
2. **1-Minute Lesson** — One concept, clear takeaway — authority building
3. **Reaction** — React to viral money takes — topical, discovery-friendly
4. **Results Proof** — Student/follower transformations — social proof

## Week 1 Calendar

**Day 1 (Pillar 1 — Myth Bust):**
Hook: "Your 401k might be making you poor. Here's the math nobody shows you."
Format: Talking head + text breakdown
Audio: Trending suspense build

**Day 2 (Pillar 2 — Lesson):**
Hook: "The 50/30/20 rule is outdated. Use this instead:"
Format: Screen recording of calculator
Audio: Upbeat lo-fi

**Day 3 (Pillar 3 — Reaction):**
Hook: "Reacting to TikTok's most viral money advice (some of this is dangerous)"
Format: Split screen reaction
Audio: Original audio from source

## Series Concept: "The $100 Challenge"
Every Friday: give followers a challenge to find $100 in savings. Document results Monday.`,
      likeCount: 378, copyCount: 289, viewCount: 4230, commentCount: 43, bookmarkCount: 112, trendingScore: 298,
      isFeatured: true,
    },
    {
      title: 'Online Course Lesson Script — Engaging Micro-Learning',
      slug: makeSlug('online-course-lesson-script-micro-learning'),
      description: 'Write complete video lesson scripts for online courses with clear learning objectives, examples, and knowledge checks.',
      content: `You are an instructional designer for top Udemy/Coursera courses. Write a complete lesson for:

**Course title:** [COURSE NAME]
**Lesson topic:** [THIS SPECIFIC LESSON]
**Lesson number:** [X of Y in module]
**Target learner:** [EXPERIENCE LEVEL + BACKGROUND]
**Learning objective:** By end of this lesson, students will be able to [VERB + SKILL]
**Lesson length:** [5 / 10 / 15 minutes]

Write:

**1. Lesson Opening (30 sec)**
- Connect to previous lesson
- State what they'll learn and why it matters NOW
- "By the end of this video, you'll know exactly how to ___"

**2. Core Content**
Use the Tell-Show-Do method:
- TELL: Explain the concept in plain language (1-2 minutes)
- SHOW: Demonstrate with real example (2-3 minutes)
- DO: Give them a mini-exercise or prompt to try

**3. Common Mistakes Section**
3 mistakes students make + how to avoid them

**4. Summary (30 sec)**
Recap 3 key points, bridge to next lesson

**5. Knowledge Check**
2 quiz questions with explanations for wrong answers

**6. Screen/Visual Direction**
Describe what to show on screen at each point`,
      aiTool: 'claude',
      generationType: 'video',
      category: 'animation',
      tags: ['online course', 'e-learning', 'instructional design', 'Udemy', 'teaching'],
      resultText: `**Course: Python for Data Science | Lesson 4.3: Pandas GroupBy Operations**

**Opening (0:00-0:30):**
"In the last lesson, you learned how to filter rows with boolean indexing. Now you're going to learn something that will save you hours every week: the GroupBy method. By the end of this 8-minute lesson, you'll be able to calculate summary statistics for any group in your data with a single line of code."

**TELL (0:30-2:00):**
"GroupBy is exactly what it sounds like — you split your data into groups, apply a function to each group, and combine the results. Think of it like a pivot table in Excel, but 100x more powerful and 10x faster."

**SHOW (2:00-5:00):**
[Screen: Jupyter notebook with sales dataset]
"I have this sales dataset with columns: Region, Product, Revenue. Let me show you 4 GroupBy patterns you'll use every week:"

    # Pattern 1: Sum by region
    df.groupby('Region')['Revenue'].sum()

    # Pattern 2: Multiple aggregations
    df.groupby('Region').agg({'Revenue': ['sum', 'mean', 'count']})

**Common Mistake #1:** Using groupby without resetting the index → show the gotcha + reset_index() fix`,
      likeCount: 198, copyCount: 156, viewCount: 2340, commentCount: 18, bookmarkCount: 56, trendingScore: 162,
    },

    {
      title: 'YouTube Shorts & Viral Video Ideas Generator',
      slug: makeSlug('youtube-shorts-viral-video-ideas-generator'),
      description: 'Generate 30 viral YouTube Shorts and short-video ideas with hooks, formats, and trend analysis for rapid channel growth.',
      content: `You are a YouTube Shorts strategist who has launched 5 channels to 100K+ subscribers. Generate video ideas for:

**Channel niche:** [YOUR TOPIC]
**Creator type:** [PERSONAL BRAND / FACELESS / EDUCATIONAL / ENTERTAINMENT]
**Current subscribers:** [NUMBER or "Starting from 0"]
**Posting goal:** [DAILY / 3X WEEK / WEEKLY]
**Competitor channels (optional):** [LIST 2-3]

Generate:

## 1. Viral Format Library (5 repeatable formats)
Each format: name, structure (60 sec breakdown), why it works, example title

## 2. 30-Day Idea Bank (30 video concepts)
For each idea:
- Title (hook-first)
- Format type
- First 3 seconds description
- Why it has viral potential (score 1-10)
- Best day/time to post

## 3. Trend Hijacking Ideas (5)
Current trends in your niche you can jump on THIS WEEK

## 4. Series Concepts (3 ongoing)
Running formats that create subscriber retention

## 5. Growth Levers for Shorts
- Best posting times for your niche
- Hashtag clusters (3 tiers)
- Cross-post strategy (TikTok + Reels + Shorts)
- How to turn a Short into a long-form video`,
      aiTool: 'chatgpt',
      generationType: 'video',
      category: 'social',
      tags: ['YouTube Shorts', 'viral video', 'content strategy', 'short-form', 'growth'],
      resultText: `**Niche: Personal Finance for 20s-30s**

## 5 Repeatable Viral Formats

**Format 1: "The Uncomfortable Math"**
Structure: Scary number → context → actionable fix (60 sec)
Example: "If you make $60k and save nothing, here's what you'll have at 65. [pause] $0. Here's the math nobody shows you."
Viral score: 9/10 — combines fear + education

**Format 2: "React to Bad Advice"**
Structure: Show viral bad finance tip → destroy it with data
Example: Reacting to "Just cut out coffee" advice with actual compound interest math
Viral score: 8/10 — controversy + authority

## 30-Day Ideas (Top 10)

1. "The $1,000 investment that beats your 401k for most people" (9/10)
2. "Why your emergency fund is actually hurting you" (8/10)
3. "The credit score mistake 90% of people make at 25" (9/10)
4. "I tracked every dollar for 30 days. Here's what I found" (8/10)
5. "The savings account your bank doesn't want you to know about" (9/10)

## Series: "Monday Money Fix"
Every Monday: one financial mistake, one 60-second fix.
Creates appointment viewing — same slot, same format, build habit.`,
      likeCount: 445, copyCount: 356, viewCount: 5120, commentCount: 52, bookmarkCount: 134, trendingScore: 356,
      isFeatured: true,
    },

    // ═══════════════════════════════════════════════════════
    // DEVELOPMENT — 10 prompts
    // ═══════════════════════════════════════════════════════
    {
      title: 'React Component Architect — TypeScript & Tailwind',
      slug: makeSlug('react-component-architect-typescript-tailwind'),
      description: 'Design scalable, accessible React components with TypeScript, custom hooks, unit tests, and Storybook stories.',
      content: `You are a senior React architect. Design and implement:

**Component:** [NAME]
**Purpose:** [WHAT IT DOES]
**Stack:** React + TypeScript + Tailwind CSS
**Variants needed:** [LIST]

Provide:

### 1. TypeScript Interface
\`\`\`typescript
interface [Name]Props {
  // All props with JSDoc comments
}
\`\`\`

### 2. Full Implementation
\`\`\`typescript
// Complete component with hooks, handlers, render
// Include: memo, useCallback, accessibility (ARIA)
\`\`\`

### 3. Custom Hook (if state logic is complex)
\`\`\`typescript
function use[Name]() { ... }
\`\`\`

### 4. Tailwind Variants
\`\`\`typescript
// cva() or cn() pattern for variant styles
\`\`\`

### 5. Usage Examples (3 variants)
\`\`\`tsx
// Default / Loading state / Error state
\`\`\`

### 6. Unit Tests
\`\`\`typescript
// React Testing Library — test user interactions, not implementation
\`\`\`

Focus: single responsibility, zero prop drilling, WCAG 2.1 AA compliance`,
      aiTool: 'claude',
      generationType: 'development',
      category: 'frontend',
      tags: ['React', 'TypeScript', 'Tailwind', 'component', 'accessibility'],
      resultText: `\`\`\`typescript
// Accessible Modal Component

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', full: 'max-w-full mx-4'
};

const Modal = React.memo(({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); prev?.focus(); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className={cn('relative bg-white rounded-xl shadow-2xl w-full', sizeClasses[size])}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close modal"
            className="p-1 rounded hover:bg-gray-100 transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
});
\`\`\``,
      likeCount: 467, copyCount: 345, viewCount: 5230, commentCount: 49, bookmarkCount: 134, trendingScore: 356,
      isFeatured: true,
    },
    {
      title: 'Code Reviewer — Security, Performance & Best Practices',
      slug: makeSlug('code-reviewer-security-performance-best-practices'),
      description: 'Get thorough code reviews covering bugs, security vulnerabilities, performance bottlenecks, and clean refactoring.',
      content: `Act as a senior engineer with 10+ years experience. Review this code:

\`\`\`
[PASTE YOUR CODE HERE]
\`\`\`
**Language/Framework:** [SPECIFY]

Analyze and provide:

### 1. Bugs & Logic Errors
List each with line number and fix

### 2. Security Vulnerabilities
Check for: SQL injection, XSS, auth bypass, insecure deserialization, IDOR, exposed secrets

### 3. Performance Issues
Check for: N+1 queries, memory leaks, blocking I/O, unnecessary re-renders, missing memoization

### 4. Code Quality
- Naming conventions
- Single responsibility violations
- DRY violations
- SOLID principles
- Cyclomatic complexity

### 5. Refactored Version
Improved code for the most critical section with explanation

Format each issue:
**Issue:** [description]
**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
**Fix:** [specific solution with code example]`,
      aiTool: 'chatgpt',
      generationType: 'development',
      category: 'backend',
      tags: ['code review', 'security', 'debugging', 'refactoring', 'best practices'],
      resultText: `## Code Review — Node.js Express Auth API

**Issue 1: SQL Injection**
🔴 Critical | Line 23: \`db.query("SELECT * FROM users WHERE id = " + req.params.id)\`
Fix: \`db.query("SELECT * FROM users WHERE id = $1", [req.params.id])\`

**Issue 2: Missing Rate Limiting on /login**
🟠 High | Brute force attack vector
Fix: Add express-rate-limit: max 10 requests per 15 min per IP

**Issue 3: JWT Secret in Code**
🔴 Critical | Line 5: \`const secret = "mysecret123"\`
Fix: \`const secret = process.env.JWT_SECRET\` — rotate secret immediately

**Issue 4: Synchronous File Read**
🟡 Medium | Line 45: \`fs.readFileSync('./config.json')\`
Fix: \`await fs.promises.readFile('./config.json')\`

**Refactored Auth Middleware:**
\`\`\`js
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    req.user = await verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
\`\`\``,
      likeCount: 534, copyCount: 412, viewCount: 5980, commentCount: 61, bookmarkCount: 156, trendingScore: 412,
      isFeatured: true,
    },
    {
      title: 'Python Data Analysis — EDA to ML Pipeline',
      slug: makeSlug('python-data-analysis-eda-ml-pipeline'),
      description: 'Complete Python workflow from data loading and EDA through feature engineering to ML model selection and evaluation.',
      content: `You are an expert Python data scientist. Help analyze:

**Dataset:** [FILENAME.csv]
**Shape:** [ROWS × COLS]
**Target:** [COLUMN NAME]
**Goal:** [PREDICTION / CLUSTERING / ANOMALY DETECTION / EDA ONLY]

Provide complete Python code for:

### 1. Exploratory Data Analysis
\`\`\`python
# Data loading, .info(), .describe(), missing values, distributions
\`\`\`

### 2. Data Cleaning
- Missing value strategy (impute vs drop — explain choice)
- Outlier detection (IQR + visual)
- Type corrections and encoding

### 3. Feature Engineering
- Relevant derived features for this domain
- Correlation analysis

### 4. Visualizations (5 most informative)
\`\`\`python
# seaborn / matplotlib — explain what each reveals
\`\`\`

### 5. ML Model Selection
For your target type, recommend top 3 models:
- Why each is appropriate
- Train/test split strategy
- Evaluation metrics (with explanation)
- Hyperparameter tuning approach (GridSearch/Optuna)

### 6. Full Pipeline
\`\`\`python
# sklearn Pipeline integrating preprocessing + model
\`\`\`

All code should be immediately runnable with comments.`,
      aiTool: 'chatgpt',
      generationType: 'development',
      category: 'backend',
      tags: ['Python', 'data science', 'pandas', 'machine learning', 'sklearn'],
      resultText: `\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score

# 1. Load & Inspect
df = pd.read_csv('customer_churn.csv')
print(f"Shape: {df.shape}")
print(f"Missing:\\n{df.isnull().sum()[df.isnull().sum() > 0]}")
print(f"Class balance:\\n{df['churn'].value_counts(normalize=True)}")

# 2. Outlier Detection (IQR)
Q1, Q3 = df['monthly_charges'].quantile([0.25, 0.75])
IQR = Q3 - Q1
outliers = df[(df['monthly_charges'] < Q1 - 1.5*IQR) |
              (df['monthly_charges'] > Q3 + 1.5*IQR)]
print(f"Outliers: {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)")

# 3. Feature Engineering
df['tenure_group'] = pd.cut(df['tenure'],
    bins=[0, 12, 24, 48, 72], labels=['<1yr', '1-2yr', '2-4yr', '4+yr'])
df['charges_per_month'] = df['total_charges'] / (df['tenure'] + 1)

# Recommended: XGBoost > Random Forest > Logistic Regression
# Metric: AUC-ROC + F1 (imbalanced classes)
\`\`\``,
      likeCount: 412, copyCount: 312, viewCount: 4670, commentCount: 44, bookmarkCount: 118, trendingScore: 312,
    },
    {
      title: 'SQL Query Optimizer & Schema Designer',
      slug: makeSlug('sql-query-optimizer-schema-designer'),
      description: 'Optimize slow SQL queries, design normalized schemas, and get index recommendations with execution plan analysis.',
      content: `You are a senior database engineer. Help with:

**Task:** [QUERY OPTIMIZATION / SCHEMA DESIGN / INDEX AUDIT / PERFORMANCE REVIEW]
**Database:** [PostgreSQL / MySQL / SQLite / MSSQL]

**Paste your slow query:**
\`\`\`sql
[YOUR QUERY]
\`\`\`
**Execution time:** [CURRENT TIME]
**Table sizes:** [ROW COUNTS]

Provide:

### 1. Query Analysis
- Identify: full table scans, N+1, missing indexes, OFFSET pagination
- EXPLAIN ANALYZE interpretation
- Estimated vs actual rows

### 2. Optimized Query
\`\`\`sql
-- Rewrite with proper JOINs, CTEs, keyset pagination
\`\`\`

### 3. Index Recommendations
\`\`\`sql
CREATE INDEX CONCURRENTLY idx_[table]_[col] ON [table]([col]);
\`\`\`
Explain WHY each index helps.

### 4. Schema Improvements
- Normalization gaps (1NF → 3NF)
- Partitioning for large tables
- JSONB vs relational trade-offs

### 5. Monitoring Query
\`\`\`sql
-- pg_stat_statements: find top slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
\`\`\``,
      aiTool: 'chatgpt',
      generationType: 'development',
      category: 'database',
      tags: ['SQL', 'PostgreSQL', 'database optimization', 'index', 'schema'],
      resultText: `## Optimization Report — Users × Orders Query

**Original (2,340ms):**
\`\`\`sql
SELECT u.*, COUNT(o.id) as order_count FROM users u
WHERE u.created_at > '2024-01-01'
AND (SELECT COUNT(*) FROM orders WHERE user_id = u.id) > 5
ORDER BY u.created_at DESC LIMIT 20 OFFSET 10000;
\`\`\`

**Issues:** ❌ Correlated subquery (N+1), ❌ OFFSET 10000 scans 10,020 rows, ❌ Missing index on created_at

**Optimized (23ms — 99% faster):**
\`\`\`sql
WITH active_buyers AS (
  SELECT user_id, COUNT(*) as order_count
  FROM orders GROUP BY user_id HAVING COUNT(*) > 5
)
SELECT u.*, ab.order_count
FROM users u
INNER JOIN active_buyers ab ON ab.user_id = u.id
WHERE u.created_at > '2024-01-01'
  AND u.id < :last_seen_id  -- keyset pagination
ORDER BY u.id DESC LIMIT 20;

CREATE INDEX CONCURRENTLY idx_users_created_at ON users(created_at);
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
\`\`\``,
      likeCount: 378, copyCount: 278, viewCount: 4230, commentCount: 38, bookmarkCount: 104, trendingScore: 288,
    },
    {
      title: 'REST API Designer — OpenAPI 3.0 Spec',
      slug: makeSlug('rest-api-designer-openapi-spec'),
      description: 'Design RESTful APIs with proper resource modeling, status codes, auth strategy, and complete OpenAPI 3.0 documentation.',
      content: `You are a senior API architect. Design a complete REST API for:

**Product:** [DESCRIBE THE SYSTEM]
**Core resources:** [LIST 3-5 main entities]
**Auth method:** [JWT / OAuth2 / API Key]
**Scale:** [STARTUP MVP / GROWTH / ENTERPRISE]

Deliver:

### 1. Resource Modeling
- Entity relationship diagram (text format)
- URL structure following REST conventions

### 2. Endpoint Design
For each resource:
\`\`\`
GET    /resources         — list with pagination
POST   /resources         — create
GET    /resources/:id     — get one
PATCH  /resources/:id     — partial update
DELETE /resources/:id     — soft delete
\`\`\`

### 3. Request/Response Schemas
\`\`\`json
// Request body and response envelope format
\`\`\`

### 4. Error Handling Standards
- Status code usage (200/201/400/401/403/404/409/422/429/500)
- Error response format

### 5. Authentication & Authorization
- Token structure and expiry
- Role-based access rules per endpoint

### 6. OpenAPI 3.0 Snippet
YAML for 2-3 key endpoints

### 7. Rate Limiting Strategy
Limits per tier, headers to return`,
      aiTool: 'claude',
      generationType: 'development',
      category: 'backend',
      tags: ['REST API', 'OpenAPI', 'API design', 'backend', 'documentation'],
      resultText: `## API Design — Multi-tenant SaaS Platform

### URL Structure
\`\`\`
/api/v1/
  workspaces/              # top-level tenant
  workspaces/:id/projects  # nested resources
  projects/:id/tasks
  users/me                 # current user shortcut
\`\`\`

### Endpoint: Create Task
\`\`\`yaml
# OpenAPI 3.0
/projects/{projectId}/tasks:
  post:
    summary: Create a task
    security: [{ BearerAuth: [] }]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [title]
            properties:
              title: { type: string, maxLength: 255 }
              assigneeId: { type: string, format: uuid }
              dueDate: { type: string, format: date }
    responses:
      '201': { description: Task created }
      '422': { description: Validation error }
\`\`\`

### Error Format (all errors)
\`\`\`json
{ "error": { "code": "VALIDATION_FAILED", "message": "...", "fields": { "title": "required" } } }
\`\`\``,
      likeCount: 334, copyCount: 245, viewCount: 3780, commentCount: 34, bookmarkCount: 92, trendingScore: 258,
    },
    {
      title: 'CI/CD Pipeline — GitHub Actions Complete Setup',
      slug: makeSlug('cicd-pipeline-github-actions-complete-setup'),
      description: 'Configure complete CI/CD pipelines with GitHub Actions for testing, building, and deploying any stack to production.',
      content: `You are a DevOps engineer. Set up a complete CI/CD pipeline using GitHub Actions for:

**Stack:** [NEXT.JS / NODE / PYTHON / GO / etc.]
**Deploy target:** [Vercel / AWS / GCP / Railway / DigitalOcean]
**Test framework:** [Jest / Pytest / Go test / etc.]
**Branch strategy:** [GITFLOW / TRUNK-BASED]

Provide complete YAML:

### 1. CI Pipeline (.github/workflows/ci.yml)
Triggers: PR to main/develop
Jobs:
- Lint (ESLint / Prettier)
- Type check
- Unit tests with coverage report
- Integration tests
- Security scan (npm audit / Snyk)
- Build verification

### 2. CD Pipeline (.github/workflows/deploy.yml)
Triggers: Push to main
Jobs:
- Run CI suite
- Build Docker image + push to registry
- Deploy to staging → smoke test → promote to production
- Slack/Discord notification on success/failure

### 3. Secrets Management
Which secrets to add + naming convention

### 4. Branch Protection Rules
Settings to configure in GitHub

### 5. Performance Optimizations
- Caching strategies (node_modules, Docker layers)
- Parallel job execution
- Conditional job skipping`,
      aiTool: 'chatgpt',
      generationType: 'development',
      category: 'devops',
      tags: ['CI/CD', 'GitHub Actions', 'DevOps', 'deployment', 'automation'],
      resultText: `\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage --passWithNoTests
      - uses: codecov/codecov-action@v4

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - uses: snyk/actions/node@master
        env: { SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }} }

  build:
    needs: [quality]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci && npm run build
\`\`\`

**Required GitHub Secrets:**
- SNYK_TOKEN, SLACK_WEBHOOK_URL, DEPLOY_TOKEN`,
      likeCount: 423, copyCount: 334, viewCount: 4890, commentCount: 47, bookmarkCount: 123, trendingScore: 334,
      isFeatured: true,
    },
    {
      title: 'Docker Compose — Full Stack Local Development',
      slug: makeSlug('docker-compose-full-stack-local-development'),
      description: 'Set up a complete Docker Compose environment for full-stack apps with hot reload, service health checks, and production parity.',
      content: `You are a DevOps specialist. Create a Docker Compose setup for:

**Stack:** [FRONTEND FRAMEWORK] + [BACKEND FRAMEWORK] + [DATABASE] + [CACHE]
**Development needs:** [HOT RELOAD / DEBUG PORT / SEED DATA]
**Services needed:** [LIST ALL: app, api, db, redis, nginx, etc.]

Provide:

### 1. docker-compose.yml (development)
\`\`\`yaml
# All services with:
# - Volume mounts for hot reload
# - Environment variable handling
# - Health checks
# - Dependency order (depends_on with condition)
# - Named networks
\`\`\`

### 2. docker-compose.prod.yml (production override)
\`\`\`yaml
# Production differences:
# - No volume mounts
# - Resource limits
# - Restart policies
# - Read-only filesystems where possible
\`\`\`

### 3. Dockerfile (multi-stage build)
\`\`\`dockerfile
# Stage 1: dependencies
# Stage 2: builder
# Stage 3: runner (minimal)
\`\`\`

### 4. .env.example
All required variables with descriptions

### 5. Makefile shortcuts
Common commands: make dev, make test, make prod, make clean

### 6. Troubleshooting Guide
Top 5 common Docker issues with fixes`,
      aiTool: 'chatgpt',
      generationType: 'development',
      category: 'devops',
      tags: ['Docker', 'Docker Compose', 'DevOps', 'containers', 'full-stack'],
      resultText: `\`\`\`yaml
# docker-compose.yml
version: '3.9'
services:
  web:
    build: { context: ./frontend, target: dev }
    ports: ['3000:3000']
    volumes: ['./frontend:/app', '/app/node_modules']
    environment:
      - NEXT_PUBLIC_API_URL=http://api:4000
    depends_on:
      api: { condition: service_healthy }

  api:
    build: { context: ./backend, target: dev }
    ports: ['4000:4000']
    volumes: ['./backend:/app', '/app/node_modules']
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/appdb
      - REDIS_URL=redis://cache:6379
    depends_on:
      db: { condition: service_healthy }
      cache: { condition: service_started }
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:4000/health']
      interval: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    volumes: ['pgdata:/var/lib/postgresql/data']
    environment: { POSTGRES_DB: appdb, POSTGRES_USER: user, POSTGRES_PASSWORD: pass }
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U user -d appdb']

volumes:
  pgdata:
\`\`\``,
      likeCount: 389, copyCount: 298, viewCount: 4450, commentCount: 42, bookmarkCount: 112, trendingScore: 302,
    },
    {
      title: 'Next.js App Router Feature Builder',
      slug: makeSlug('nextjs-app-router-feature-builder'),
      description: 'Build complete Next.js 14+ features with Server Components, API routes, Prisma/MongoDB, and TypeScript best practices.',
      content: `You are a senior Next.js architect. Implement this feature:

**Feature:** [DESCRIBE WHAT YOU WANT TO BUILD]
**Next.js version:** 14+ (App Router)
**Database:** [Prisma + PostgreSQL / MongoDB / Supabase]
**Auth:** [NextAuth / Clerk / custom]
**UI:** [Tailwind + shadcn/ui / custom]

Implement completely:

### 1. File Structure
\`\`\`
app/
  (route-group)/
    feature/
      page.tsx          -- Server Component
      loading.tsx       -- Suspense boundary
      error.tsx         -- Error boundary
      [id]/
        page.tsx
components/
  feature/
    FeatureClient.tsx   -- Client Component
api/
  feature/
    route.ts            -- Route Handler
\`\`\`

### 2. Server Component (page.tsx)
Data fetching with proper caching strategy

### 3. Client Component
Interactive elements with optimistic updates

### 4. API Route Handler
With Zod validation and proper error handling

### 5. Database Layer
Schema + queries (Prisma schema or Mongoose model)

### 6. Type Safety
Shared types between client/server

### 7. Error Handling
Loading, error, and empty states`,
      aiTool: 'claude',
      generationType: 'development',
      category: 'frontend',
      tags: ['Next.js', 'App Router', 'TypeScript', 'React', 'full-stack'],
      resultText: `\`\`\`typescript
// app/dashboard/posts/page.tsx (Server Component)
import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import { PostList } from '@/components/posts/PostList';
import { PostListSkeleton } from '@/components/posts/PostListSkeleton';

export default async function PostsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>
      <Suspense fallback={<PostListSkeleton />}>
        <PostListWrapper />
      </Suspense>
    </div>
  );
}

async function PostListWrapper() {
  await connectDB();
  const posts = await Post.find({ status: 'published' })
    .sort({ createdAt: -1 }).limit(20).lean();
  return <PostList posts={JSON.parse(JSON.stringify(posts))} />;
}

// app/api/posts/route.ts — with Zod validation
import { z } from 'zod';
const CreatePostSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50),
});

export async function POST(req: Request) {
  const body = await req.json();
  const validated = CreatePostSchema.safeParse(body);
  if (!validated.success) {
    return Response.json({ error: validated.error.flatten() }, { status: 422 });
  }
  // ... create post
}
\`\`\``,
      likeCount: 445, copyCount: 334, viewCount: 5120, commentCount: 52, bookmarkCount: 134, trendingScore: 356,
      isFeatured: true,
    },
    {
      title: 'Unit & Integration Test Generator',
      slug: makeSlug('unit-integration-test-generator'),
      description: 'Generate comprehensive test suites with edge cases, mocking strategies, and coverage for any function or API endpoint.',
      content: `You are a test engineering expert. Generate a complete test suite for:

**Code to test:**
\`\`\`
[PASTE FUNCTION / CLASS / API ROUTE HERE]
\`\`\`
**Test framework:** [Jest / Vitest / Pytest / Go test]
**Testing library:** [React Testing Library / Supertest / httpx]

Generate:

### 1. Unit Tests
For each function/method:
- Happy path (expected input → expected output)
- Edge cases (empty, null, boundary values)
- Error cases (invalid input, network failure)

### 2. Integration Tests (if applicable)
- API endpoint: request → response cycle
- Database: actual queries with test database

### 3. Mocking Strategy
\`\`\`typescript
// What to mock and how
// jest.mock() / vi.mock() patterns
// Database mocks vs in-memory alternatives
\`\`\`

### 4. Test Data Factories
\`\`\`typescript
// Builder pattern for creating test fixtures
const createUser = (overrides = {}) => ({
  id: 'test-id', name: 'Test User', ...overrides
});
\`\`\`

### 5. Coverage Checklist
Which lines/branches are covered and which aren't

### 6. Testing Anti-Patterns to Avoid
What NOT to test in this codebase`,
      aiTool: 'claude',
      generationType: 'development',
      category: 'backend',
      tags: ['testing', 'Jest', 'unit test', 'TDD', 'coverage'],
      resultText: `\`\`\`typescript
// Testing a user authentication function
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateUser } from './auth';
import { db } from '@/lib/db';
import { hashPassword } from './crypto';

// Mock database
vi.mock('@/lib/db', () => ({
  db: { user: { findUnique: vi.fn() } }
}));

const createUser = (overrides = {}) => ({
  id: 'user-123', email: 'test@example.com',
  passwordHash: '$2b$10$hashedpassword', status: 'active',
  ...overrides
});

describe('authenticateUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns user on valid credentials', async () => {
    const user = createUser();
    vi.mocked(db.user.findUnique).mockResolvedValue(user);
    const result = await authenticateUser('test@example.com', 'password123');
    expect(result).toEqual({ id: user.id, email: user.email });
    expect(result).not.toHaveProperty('passwordHash'); // never expose hash
  });

  it('throws on wrong password', async () => {
    vi.mocked(db.user.findUnique).mockResolvedValue(createUser());
    await expect(authenticateUser('test@example.com', 'wrong'))
      .rejects.toThrow('Invalid credentials');
  });

  it('throws on suspended account', async () => {
    vi.mocked(db.user.findUnique).mockResolvedValue(createUser({ status: 'suspended' }));
    await expect(authenticateUser('test@example.com', 'password123'))
      .rejects.toThrow('Account suspended');
  });

  it('returns null for non-existent user', async () => {
    vi.mocked(db.user.findUnique).mockResolvedValue(null);
    const result = await authenticateUser('ghost@example.com', 'any');
    expect(result).toBeNull();
  });
});
\`\`\``,
      likeCount: 312, copyCount: 234, viewCount: 3560, commentCount: 31, bookmarkCount: 89, trendingScore: 242,
    },
    {
      title: 'Database Schema Designer — Normalized & Production-Ready',
      slug: makeSlug('database-schema-designer-normalized-production'),
      description: 'Design normalized database schemas with proper indexes, constraints, and migration scripts for any application domain.',
      content: `You are a database architect. Design a production-ready schema for:

**Application:** [DESCRIBE YOUR APP]
**Database:** [PostgreSQL / MySQL / MongoDB]
**Scale:** [USERS: 1K / 100K / 1M+]
**Core entities:** [LIST 4-6 main concepts]

Deliver:

### 1. Entity-Relationship Diagram (text format)
Show relationships: one-to-one, one-to-many, many-to-many

### 2. Table/Collection Definitions
For each entity:
\`\`\`sql
CREATE TABLE [name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- columns with constraints
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

### 3. Indexes Strategy
\`\`\`sql
-- Explain the query pattern each index supports
CREATE INDEX idx_[table]_[col] ON [table]([col]);
\`\`\`

### 4. Constraints & Data Integrity
- Foreign keys with ON DELETE strategy
- CHECK constraints
- UNIQUE constraints

### 5. Soft Delete Pattern
If applicable, explain approach

### 6. Migration File (Prisma or raw SQL)

### 7. Potential Scaling Issues
- Tables likely to be large
- Partitioning candidates
- Archive strategy for old data`,
      aiTool: 'claude',
      generationType: 'development',
      category: 'database',
      tags: ['database design', 'schema', 'PostgreSQL', 'normalization', 'Prisma'],
      resultText: `## Schema — Multi-tenant SaaS (Project Management)

### ERD (simplified)
\`\`\`
Organizations (1) ──< (N) Users
Users (N) ──< (N) Projects  [via project_members]
Projects (1) ──< (N) Tasks
Tasks (1) ──< (N) Comments
Tasks (N) ──< (N) Tags  [via task_tags]
\`\`\`

### Core Tables
\`\`\`sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 500),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','done','cancelled')),
  priority SMALLINT DEFAULT 2 CHECK (priority BETWEEN 1 AND 5),
  due_date DATE,
  deleted_at TIMESTAMPTZ,  -- soft delete
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Composite index for the most common query: project's open tasks by priority
CREATE INDEX idx_tasks_project_status_priority
  ON tasks(project_id, status, priority DESC)
  WHERE deleted_at IS NULL;
\`\`\``,
      likeCount: 356, copyCount: 267, viewCount: 4120, commentCount: 36, bookmarkCount: 98, trendingScore: 274,
    },

  ];

  // Attach author to all prompts
  const promptsWithAuthor = prompts.map(p => ({
    ...p,
    author: user._id,
    authorName: 'PromptAll Team',
    authorUsername: 'promptall',
    language: (p as any).language ?? 'en',
    translations: {},
  }));

  let created = 0;
  for (const data of promptsWithAuthor) {
    try {
      await Prompt.create(data);
      created++;
      console.log(`✅ [${data.generationType}/${data.category}] ${data.title}`);
    } catch (e: any) {
      console.error(`❌ ${data.title} — ${e.message}`);
    }
  }

  await User.findByIdAndUpdate(user._id, { promptCount: created });
  console.log(`\n🎉 Done! Created ${created} / ${prompts.length} prompts`);
  console.log(`   Text: ${prompts.filter(p => p.generationType === 'text').length}`);
  console.log(`   Image: ${prompts.filter(p => p.generationType === 'image').length}`);
  console.log(`   Video: ${prompts.filter(p => p.generationType === 'video').length}`);
  console.log(`   Development: ${prompts.filter(p => p.generationType === 'development').length}`);
  await mongoose.disconnect();
}

seed().catch(console.error);
