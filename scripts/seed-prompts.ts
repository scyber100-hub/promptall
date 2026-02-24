import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || '';

const SEED_USER = {
  _id: new mongoose.Types.ObjectId(),
  name: 'PromptAll Team',
  username: 'promptall',
  authorName: 'PromptAll Team',
  authorUsername: 'promptall',
};

function slug(title: string) {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().slice(0, 80) + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

type PromptSeed = {
  title: string;
  content: string;
  generationType: string;
  category: string;
  aiTool: string;
  tags: string[];
  trendingScore: number;
  likeCount: number;
  description?: string;
};

const PROMPTS: PromptSeed[] = [
  // ──────────────── TEXT / business ────────────────
  {
    title: 'Business Plan Generator',
    content: `Create a comprehensive business plan for: [BUSINESS IDEA]\n\nInclude:\n1. Executive Summary\n2. Company Description & Mission\n3. Market Analysis (TAM/SAM/SOM)\n4. Competitive Analysis\n5. Products/Services\n6. Marketing & Sales Strategy\n7. Operations Plan\n8. Management Team\n9. Financial Projections (3-year)\n10. Funding Requirements\n\nTarget market: [TARGET MARKET]\nInitial budget: [BUDGET]\nGeography: [LOCATION]`,
    generationType: 'text', category: 'business', aiTool: 'chatgpt',
    tags: ['business-plan', 'startup', 'strategy'], trendingScore: 95, likeCount: 412,
  },
  {
    title: 'Investor Pitch Deck Script',
    content: `Write a compelling 10-slide investor pitch deck script for [STARTUP NAME].\n\nSlides: Problem → Solution → Market Size → Product Demo → Business Model → Traction → Team → Financials → Ask → Vision\n\nCompany stage: [STAGE]\nFunding ask: [AMOUNT]\nKey metric: [YOUR BEST METRIC]\n\nMake each slide punchy, data-driven, and tell a cohesive story.`,
    generationType: 'text', category: 'business', aiTool: 'claude',
    tags: ['pitch', 'investor', 'startup', 'fundraising'], trendingScore: 91, likeCount: 356,
  },
  {
    title: 'Market Entry Strategy',
    content: `Develop a market entry strategy for [COMPANY] entering [TARGET MARKET/COUNTRY].\n\nAnalyze:\n- Market size and growth rate\n- Entry barriers\n- Key competitors\n- Customer segments\n- Recommended entry mode (JV, acquisition, greenfield, export)\n- Go-to-market timeline\n- Risk mitigation\n\nIndustry: [INDUSTRY]\nBudget: [BUDGET]`,
    generationType: 'text', category: 'business', aiTool: 'chatgpt',
    tags: ['market-entry', 'strategy', 'international'], trendingScore: 88, likeCount: 287,
  },
  {
    title: 'SWOT Analysis Framework',
    content: `Conduct a thorough SWOT analysis for [COMPANY/PRODUCT].\n\nContext:\n- Industry: [INDUSTRY]\n- Stage: [STARTUP/GROWTH/MATURE]\n- Key competitors: [COMPETITORS]\n\nFor each quadrant, provide 5 specific, actionable insights.\nConvert SWOT into SO/ST/WO/WT strategic options.\nPrioritize top 3 strategic initiatives.`,
    generationType: 'text', category: 'business', aiTool: 'gemini',
    tags: ['swot', 'strategy', 'analysis'], trendingScore: 85, likeCount: 243,
  },
  {
    title: 'Financial Model Builder',
    content: `Build a 3-year financial model for [BUSINESS TYPE].\n\nAssumptions:\n- Revenue streams: [LIST]\n- Pricing: [MODEL]\n- Growth rate: [%/year]\n- Fixed costs: [AMOUNT]\n- Variable costs: [% of revenue]\n\nOutput:\n- P&L statement\n- Cash flow statement\n- Break-even analysis\n- Key metrics (CAC, LTV, gross margin)\n- Sensitivity scenarios (bear/base/bull)`,
    generationType: 'text', category: 'business', aiTool: 'chatgpt',
    tags: ['financial-model', 'forecasting', 'startup'], trendingScore: 89, likeCount: 321,
  },

  // ──────────────── TEXT / academic ────────────────
  {
    title: 'Research Paper Outline Builder',
    content: `Create a detailed research paper outline on: [RESEARCH TOPIC]\n\nAcademic field: [FIELD]\nResearch question: [YOUR QUESTION]\nMethodology: [QUALITATIVE/QUANTITATIVE/MIXED]\n\nProvide:\n- Abstract template\n- Introduction structure (background, gap, objective)\n- Literature review themes\n- Methodology section\n- Expected results structure\n- Discussion points\n- Conclusion framework\n- Reference style: [APA/MLA/Chicago/IEEE]`,
    generationType: 'text', category: 'academic', aiTool: 'claude',
    tags: ['research', 'paper', 'academic', 'outline'], trendingScore: 93, likeCount: 478,
  },
  {
    title: 'Thesis Statement Crafter',
    content: `Help me craft a strong thesis statement for my [PAPER TYPE] on [TOPIC].\n\nContext:\n- Course: [COURSE/SUBJECT]\n- Argument direction: [YOUR POSITION]\n- Evidence available: [BRIEF LIST]\n\nGenerate 3 thesis statement options ranging from:\n1. Conservative/safe\n2. Moderate claim\n3. Bold/controversial\n\nExplain the strength and risk of each, then help refine the best one.`,
    generationType: 'text', category: 'academic', aiTool: 'claude',
    tags: ['thesis', 'essay', 'academic-writing'], trendingScore: 87, likeCount: 312,
  },
  {
    title: 'Literature Review Synthesizer',
    content: `Write a literature review section synthesizing the following sources:\n\n[PASTE ABSTRACTS OR SUMMARIES HERE]\n\nTopic: [YOUR TOPIC]\nFocus: [SPECIFIC ASPECT]\n\nStructure the review to:\n- Identify major themes across sources\n- Show evolution of research\n- Highlight gaps and contradictions\n- Position your research within the field\n- Use academic hedging language\nLength: ~600 words`,
    generationType: 'text', category: 'academic', aiTool: 'chatgpt',
    tags: ['literature-review', 'research', 'synthesis'], trendingScore: 84, likeCount: 267,
  },
  {
    title: 'Statistical Analysis Interpreter',
    content: `Interpret the following statistical results for a non-expert audience:\n\n[PASTE YOUR RESULTS/OUTPUT]\n\nStudy topic: [TOPIC]\nSample size: [N]\nMethod used: [REGRESSION/ANOVA/T-TEST/etc.]\n\nExplain:\n- What the results mean in plain language\n- Statistical significance and practical significance\n- Limitations of the findings\n- How to present this in the discussion section\n- Appropriate cautions when generalizing`,
    generationType: 'text', category: 'academic', aiTool: 'gemini',
    tags: ['statistics', 'data-analysis', 'research'], trendingScore: 82, likeCount: 198,
  },

  // ──────────────── TEXT / marketing ────────────────
  {
    title: 'Content Marketing Strategy',
    content: `Develop a 3-month content marketing strategy for [BRAND/PRODUCT].\n\nGoals: [AWARENESS/LEADS/RETENTION]\nTarget audience: [PERSONA]\nChannels: [BLOG/SOCIAL/EMAIL/VIDEO]\nBudget: [MONTHLY BUDGET]\n\nDeliver:\n- Content pillars (3-5 themes)\n- Monthly content calendar with topics\n- Channel-specific formats\n- KPIs and success metrics\n- Distribution and promotion plan\n- Repurposing workflow`,
    generationType: 'text', category: 'marketing', aiTool: 'chatgpt',
    tags: ['content-marketing', 'strategy', 'SEO'], trendingScore: 94, likeCount: 523,
  },
  {
    title: 'Customer Persona Creator',
    content: `Create detailed buyer personas for [PRODUCT/SERVICE].\n\nAvailable data:\n- Current customers: [DESCRIPTION]\n- Market research: [KEY FINDINGS]\n- Product use case: [HOW IT'S USED]\n\nFor each persona (create 2-3) include:\n- Demographics and psychographics\n- Goals and challenges\n- Buying triggers and objections\n- Preferred channels\n- Decision-making process\n- Quote that captures their mindset\n- Content they consume`,
    generationType: 'text', category: 'marketing', aiTool: 'claude',
    tags: ['persona', 'customer-research', 'marketing'], trendingScore: 90, likeCount: 398,
  },
  {
    title: 'SEO Content Brief Generator',
    content: `Create a comprehensive SEO content brief for the keyword: [TARGET KEYWORD]\n\nContext:\n- Website: [NICHE/INDUSTRY]\n- Current ranking: [POSITION or "not ranking"]\n- Domain authority: [DA SCORE]\n- Target audience: [DESCRIPTION]\n\nBrief should include:\n- Search intent analysis\n- Content type recommendation\n- Title and meta description (3 options each)\n- Target word count\n- H2/H3 structure with semantic keywords\n- Internal linking suggestions\n- Featured snippet opportunity\n- Key questions to answer (People Also Ask)`,
    generationType: 'text', category: 'marketing', aiTool: 'chatgpt',
    tags: ['seo', 'content-brief', 'keyword'], trendingScore: 92, likeCount: 445,
  },
  {
    title: 'Email Marketing Sequence',
    content: `Write a 5-email welcome sequence for [BUSINESS TYPE].\n\nProduct/Service: [DESCRIPTION]\nTarget subscriber: [WHO SIGNED UP]\nGoal: [CONVERSION GOAL]\n\nEmail 1 (Day 0): Welcome & quick win\nEmail 2 (Day 2): Your biggest problem\nEmail 3 (Day 4): Social proof & case study\nEmail 4 (Day 6): Overcome main objection\nEmail 5 (Day 8): Limited-time offer\n\nFor each: Subject line (3 options), preview text, body copy, CTA`,
    generationType: 'text', category: 'marketing', aiTool: 'chatgpt',
    tags: ['email-marketing', 'sequence', 'automation'], trendingScore: 88, likeCount: 334,
  },

  // ──────────────── TEXT / writing ────────────────
  {
    title: 'Expert Blog Post Writer',
    content: `Act as an expert blog writer. Write a comprehensive, SEO-optimized blog post about [TOPIC] that is engaging, well-researched, and actionable. Structure it with:\n- A compelling headline\n- An engaging introduction with a hook\n- 5-7 main sections with subheadings\n- Practical examples and data points\n- A strong conclusion with a call-to-action\n\nTarget audience: [YOUR AUDIENCE]\nTone: [professional/casual/conversational]\nWord count: approximately 1500 words`,
    generationType: 'text', category: 'writing', aiTool: 'chatgpt',
    tags: ['blog', 'seo', 'content', 'writing'], trendingScore: 95, likeCount: 612,
  },
  {
    title: 'Viral Short Story Generator',
    content: `Write a captivating short story (500-800 words) with the following specifications:\n\nGenre: [GENRE - e.g., thriller, romance, sci-fi]\nSetting: [SETTING]\nMain character: [CHARACTER DESCRIPTION]\nConflict: [MAIN CONFLICT]\n\nRequirements:\n- Start with an attention-grabbing first sentence\n- Build tension throughout\n- Include vivid sensory details\n- End with a satisfying or thought-provoking conclusion\n- Use dialogue to reveal character`,
    generationType: 'text', category: 'writing', aiTool: 'chatgpt',
    tags: ['story', 'fiction', 'creative'], trendingScore: 88, likeCount: 487,
  },
  {
    title: 'Copywriting AIDA Framework',
    content: `Write compelling sales copy using the AIDA framework for [PRODUCT/SERVICE]:\n\nProduct/Service: [NAME]\nTarget audience: [WHO THEY ARE]\nKey benefit: [MAIN VALUE PROPOSITION]\nPrice point: [PRICE]\n\nATTENTION: Hook that grabs attention immediately\nINTEREST: Build interest with benefits and features\nDESIRE: Create emotional desire through storytelling\nACTION: Clear, urgent call-to-action\n\nKeep total length under 300 words.`,
    generationType: 'text', category: 'writing', aiTool: 'claude',
    tags: ['copywriting', 'marketing', 'sales', 'aida'], trendingScore: 91, likeCount: 512,
  },
  {
    title: 'LinkedIn Post That Gets Engagement',
    content: `Write a LinkedIn post about [TOPIC] that generates high engagement.\n\nContext: I am a [YOUR ROLE] at [COMPANY/INDUSTRY]\nKey insight to share: [YOUR MAIN POINT]\nPersonal experience: [BRIEF STORY OR EXAMPLE]\n\nFormat:\n- Opening hook (1-2 lines, no "I" start)\n- Personal story or data point\n- 3-5 key lessons or takeaways\n- Thought-provoking question at the end\n- Relevant hashtags (3-5)\n\nTone: Authentic, conversational, value-driven\nLength: 150-250 words`,
    generationType: 'text', category: 'writing', aiTool: 'chatgpt',
    tags: ['linkedin', 'social-media', 'personal-brand'], trendingScore: 90, likeCount: 398,
  },
  {
    title: 'Newsletter That People Actually Read',
    content: `Write a weekly newsletter edition about [TOPIC/NICHE].\n\nNewsletter name: [NAME]\nEdition theme: [THIS WEEK'S THEME]\nMain story: [KEY TOPIC]\n\nStructure:\n- Subject line (curiosity gap formula)\n- Preview text\n- Personal opener (2-3 sentences)\n- Main story (300-400 words)\n- Quick hits section (3 short items)\n- Recommendation (tool/book/article)\n- Sign-off with personality\n\nTone: Like a smart friend sharing insights.`,
    generationType: 'text', category: 'writing', aiTool: 'claude',
    tags: ['newsletter', 'email', 'content-marketing'], trendingScore: 84, likeCount: 298,
  },

  // ──────────────── TEXT / education ────────────────
  {
    title: 'Lesson Plan Creator',
    content: `Create a detailed lesson plan for teaching [TOPIC].\n\nGrade/Level: [GRADE OR ADULT LEARNER]\nClass duration: [TIME]\nClass size: [NUMBER]\nLearning objectives: [WHAT STUDENTS WILL KNOW/DO]\n\nInclude:\n- Warm-up activity (5 min)\n- Main instruction with teaching methods\n- Interactive activities and exercises\n- Assessment/check for understanding\n- Homework or extension tasks\n- Differentiation for advanced and struggling students\n- Materials needed`,
    generationType: 'text', category: 'education', aiTool: 'chatgpt',
    tags: ['lesson-plan', 'teaching', 'education'], trendingScore: 87, likeCount: 312,
  },
  {
    title: 'Feynman Technique Explainer',
    content: `Explain [COMPLEX CONCEPT] using the Feynman Technique.\n\nAudience: [COMPLETE BEGINNER / 12-year-old / non-expert]\nField: [SUBJECT AREA]\n\nSteps:\n1. Simple plain-language explanation (no jargon)\n2. Analogy connecting to everyday experience\n3. Visual description or mental model\n4. Common misconceptions to avoid\n5. Why this matters in real life\n6. Next steps for deeper learning\n\nCheck: If a child can understand it, the explanation works.`,
    generationType: 'text', category: 'education', aiTool: 'claude',
    tags: ['feynman', 'explanation', 'learning'], trendingScore: 93, likeCount: 567,
  },
  {
    title: 'Quiz Question Generator',
    content: `Generate a comprehensive quiz on [TOPIC].\n\nLevel: [BEGINNER/INTERMEDIATE/ADVANCED]\nNumber of questions: [N]\nQuestion types: [MCQ/True-False/Short Answer/Fill-in]\n\nFor each question include:\n- The question\n- For MCQ: 4 options with only one correct\n- Correct answer\n- Brief explanation of why it's correct\n- Difficulty rating (1-5)\n\nEnsure questions test different cognitive levels (recall, comprehension, application, analysis).`,
    generationType: 'text', category: 'education', aiTool: 'gemini',
    tags: ['quiz', 'assessment', 'learning'], trendingScore: 85, likeCount: 276,
  },

  // ──────────────── TEXT / creative ────────────────
  {
    title: 'Brainstorming Facilitator',
    content: `Facilitate a creative brainstorming session on: [PROBLEM OR CHALLENGE]\n\nContext: [BRIEF BACKGROUND]\nConstraints: [BUDGET/TIME/TECHNICAL LIMITS]\nGoal: [DESIRED OUTCOME]\n\nUse these techniques:\n1. 100 ideas in 10 minutes (quantity first)\n2. Reverse brainstorming (how to make it worse?)\n3. Random word association\n4. SCAMPER method\n5. "Yes, and..." building\n\nThen filter to top 5 most promising ideas with quick feasibility notes.`,
    generationType: 'text', category: 'creative', aiTool: 'chatgpt',
    tags: ['brainstorming', 'creativity', 'ideation'], trendingScore: 89, likeCount: 345,
  },
  {
    title: 'Brand Name Generator',
    content: `Generate creative brand names for [PRODUCT/COMPANY TYPE].\n\nIndustry: [INDUSTRY]\nTarget customer: [DEMOGRAPHIC]\nBrand personality: [ADJECTIVES: e.g., bold, playful, trustworthy]\nAvoid: [WORDS/STYLES TO AVOID]\n\nGenerate 20 name options across these styles:\n- Invented/made-up words\n- Metaphorical names\n- Portmanteau combinations\n- Descriptive names\n- Founder/location inspired\n\nFor each: name, pronunciation guide, meaning/rationale, available .com likelihood.`,
    generationType: 'text', category: 'creative', aiTool: 'claude',
    tags: ['branding', 'naming', 'startup'], trendingScore: 86, likeCount: 298,
  },
  {
    title: 'World Building for Fiction',
    content: `Help me build a fictional world for [GENRE] story.\n\nCore concept: [YOUR PREMISE]\nTime period: [ERA OR FUTURE YEAR]\nMagic/Tech system: [RULES]\n\nDevelop:\n- Geography and climate\n- Political systems and power structures\n- Economy and resources\n- Culture, religion, traditions\n- History (key events last 200 years)\n- Conflict tensions\n- Unique flora, fauna, or phenomena\n- Linguistic quirks\n\nFocus on internal consistency and how each element affects the others.`,
    generationType: 'text', category: 'creative', aiTool: 'claude',
    tags: ['world-building', 'fiction', 'fantasy', 'sci-fi'], trendingScore: 91, likeCount: 423,
  },

  // ──────────────── TEXT / productivity ────────────────
  {
    title: 'Meeting Agenda Generator',
    content: `Create an effective meeting agenda for: [MEETING PURPOSE]\n\nAttendees: [ROLES/DEPARTMENTS]\nDuration: [TIME]\nDesired outcome: [DECISION/UPDATE/BRAINSTORM]\n\nAgenda should:\n- Start with a clear objective statement\n- Time-box each agenda item\n- Assign owner for each item\n- Include pre-reading requirements\n- End with next steps and action items template\n- Include energy check-in for long meetings\n\nAlso provide: 3 meeting norms to set ground rules`,
    generationType: 'text', category: 'productivity', aiTool: 'chatgpt',
    tags: ['meeting', 'agenda', 'productivity'], trendingScore: 88, likeCount: 367,
  },
  {
    title: 'OKR Framework Builder',
    content: `Create OKRs (Objectives and Key Results) for [TEAM/COMPANY] for [QUARTER/YEAR].\n\nCompany mission: [MISSION]\nStrategic priorities: [TOP 3]\nPrevious quarter performance: [BRIEF]\n\nFor each objective (create 3-4):\n- Clear, inspiring objective statement\n- 3 measurable key results (specific numbers)\n- Stretch vs. committed targets\n- Owner assignment\n- Leading indicators to track\n- Risks and dependencies\n\nEnsure OKRs are ambitious but achievable (70% success = good).`,
    generationType: 'text', category: 'productivity', aiTool: 'claude',
    tags: ['okr', 'goal-setting', 'management'], trendingScore: 85, likeCount: 312,
  },
  {
    title: 'Weekly Review Template',
    content: `Guide me through a comprehensive weekly review.\n\nContext:\n- Role: [JOB/PERSONAL GOALS]\n- This week's focus: [MAIN PROJECTS]\n- Energy level trend: [HIGH/MEDIUM/LOW]\n\nReview sections:\n1. Capture (what's unprocessed in my head?)\n2. Wins (what went well?)\n3. Misses (what didn't happen? why?)\n4. Lessons (what did I learn?)\n5. Gratitude (3 specific things)\n6. Next week priorities (top 3)\n7. One thing to improve\n\nKeep questions reflective and forward-focused.`,
    generationType: 'text', category: 'productivity', aiTool: 'gemini',
    tags: ['weekly-review', 'reflection', 'productivity'], trendingScore: 82, likeCount: 234,
  },

  // ──────────────── IMAGE / illustration ────────────────
  {
    title: 'Anime Character Illustration',
    content: `[CHARACTER DESCRIPTION], anime illustration style, soft pastel colors, clean linework, detailed eyes with light reflection, expressive facial expression, dynamic pose, flowy clothing details, Studio Ghibli inspired soft background, gentle lighting, trending on Pixiv, high quality, by Ilya Kuvshinov`,
    generationType: 'image', category: 'illustration', aiTool: 'midjourney',
    tags: ['anime', 'character', 'illustration', 'pixiv'], trendingScore: 96, likeCount: 834,
  },
  {
    title: 'Storybook Children\'s Illustration',
    content: `Whimsical children's book illustration of [SCENE DESCRIPTION], watercolor style, warm and cozy palette, rounded soft shapes, no sharp edges, golden afternoon light, friendly and inviting atmosphere, by Eric Carle and Beatrix Potter, 2D flat illustration, thick outlines, magical forest setting`,
    generationType: 'image', category: 'illustration', aiTool: 'dalle',
    tags: ['childrens-book', 'watercolor', 'whimsical', 'illustration'], trendingScore: 89, likeCount: 612,
  },
  {
    title: 'Fantasy Map Illustration',
    content: `Hand-drawn fantasy map of [WORLD NAME], parchment texture background, illustrated with mountains, forests, oceans, ancient ruins, city icons, compass rose, decorative borders, ink and watercolor style, aged paper look, cartographic detail, like a medieval fantasy atlas, high resolution`,
    generationType: 'image', category: 'illustration', aiTool: 'midjourney',
    tags: ['fantasy-map', 'world-building', 'cartography'], trendingScore: 87, likeCount: 543,
  },
  {
    title: 'Technical Vector Icon Set',
    content: `Clean minimal vector icon for [CONCEPT], flat design style, single color [COLOR], geometric shapes, simple and recognizable at 24px, modern UI icon aesthetic, no gradients, suitable for app interface, white background, rounded corners, pixel-perfect`,
    generationType: 'image', category: 'illustration', aiTool: 'dalle',
    tags: ['icon', 'vector', 'ui', 'flat-design'], trendingScore: 83, likeCount: 387,
  },

  // ──────────────── IMAGE / photo ────────────────
  {
    title: 'Cinematic Portrait Photography',
    content: `[SUBJECT DESCRIPTION], cinematic portrait photography, shot on Hasselblad medium format, 85mm f/1.4 lens, golden hour lighting, bokeh background, shallow depth of field, film grain, Kodak Portra 400, natural skin tones, editorial style, high resolution, award winning photography`,
    generationType: 'image', category: 'photo', aiTool: 'midjourney',
    tags: ['portrait', 'photography', 'cinematic', 'realistic'], trendingScore: 94, likeCount: 723,
  },
  {
    title: 'Food Photography Masterpiece',
    content: `[DISH NAME] food photography, dark moody styling, dramatic side lighting, selective focus, shallow DOF, steam effect, rustic wooden surface, garnished with [HERBS/TOPPINGS], droplets of olive oil glistening, restaurant quality, Michelin star plating, shot on Canon R5, 100mm macro lens`,
    generationType: 'image', category: 'photo', aiTool: 'midjourney',
    tags: ['food-photography', 'restaurant', 'culinary', 'moody'], trendingScore: 91, likeCount: 656,
  },
  {
    title: 'Urban Street Photography',
    content: `Street photography of [CITY/LOCATION], candid moment, decisive moment composition, black and white, high contrast, 35mm film aesthetic, Leica quality, rain reflections on pavement, figures in motion, shallow focus with bokeh background, documentary style, humanistic photography, shot at dusk`,
    generationType: 'image', category: 'photo', aiTool: 'stable-diffusion',
    tags: ['street-photography', 'urban', 'black-and-white', 'documentary'], trendingScore: 88, likeCount: 534,
  },

  // ──────────────── IMAGE / design ────────────────
  {
    title: 'Minimalist Logo Design',
    content: `Minimalist logo for [COMPANY NAME] in the [INDUSTRY] industry, geometric shapes, single color [COLOR], negative space usage, scalable vector style, modern and professional, works at any size, clean sans-serif typography if included, Swiss design influence, timeless not trendy`,
    generationType: 'image', category: 'design', aiTool: 'dalle',
    tags: ['logo', 'branding', 'minimalist', 'corporate'], trendingScore: 92, likeCount: 678,
  },
  {
    title: 'Social Media Template Design',
    content: `Instagram post template design for [BRAND/NICHE], modern clean layout, [BRAND COLOR] palette, bold typography, [1080x1080px] square format, grid-safe margins, space for headline and subtext, subtle texture background, high contrast, suitable for Canva or Adobe, professional brand aesthetic`,
    generationType: 'image', category: 'design', aiTool: 'dalle',
    tags: ['social-media', 'template', 'instagram', 'branding'], trendingScore: 87, likeCount: 512,
  },
  {
    title: 'Infographic Layout Design',
    content: `Data visualization infographic about [TOPIC], clean modern style, [COLOR PALETTE], clear visual hierarchy, icons and charts, numbered steps or statistics, white space balanced, readable at A4 size, professional editorial design, corporate report style, information design best practices`,
    generationType: 'image', category: 'design', aiTool: 'dalle',
    tags: ['infographic', 'data-visualization', 'information-design'], trendingScore: 84, likeCount: 423,
  },

  // ──────────────── IMAGE / art ────────────────
  {
    title: 'Fantasy Character Art',
    content: `[CHARACTER DESCRIPTION] fantasy character, epic fantasy art style, dramatic rim lighting, intricate armor with worn details, magical aura glowing, dynamic action pose, ultra-detailed, 8K resolution, by Greg Rutkowski and Artgerm, trending on ArtStation, vibrant jewel-tone colors, cinematic composition`,
    generationType: 'image', category: 'art', aiTool: 'midjourney',
    tags: ['fantasy', 'character', 'concept-art', 'artstation'], trendingScore: 97, likeCount: 1024,
  },
  {
    title: 'Abstract Digital Art',
    content: `Abstract digital art [EMOTION/CONCEPT], fluid organic shapes, [COLOR 1] and [COLOR 2] color harmony, flowing liquid-like forms, subtle texture overlay, neon accents, generative art aesthetic, high contrast, contemporary art gallery quality, 4K resolution, by Refik Anadol inspired`,
    generationType: 'image', category: 'art', aiTool: 'midjourney',
    tags: ['abstract', 'digital-art', 'generative', 'contemporary'], trendingScore: 93, likeCount: 756,
  },
  {
    title: 'Sci-Fi Concept Art',
    content: `[SCENE DESCRIPTION] sci-fi concept art, hard surface design, biopunk/cyberpunk aesthetic, neon lighting against dark environment, atmospheric perspective, detailed mechanical elements, chrome and matte surfaces, engine glow effects, by John Berkey and Syd Mead, ultra-detailed, 8K cinematic`,
    generationType: 'image', category: 'art', aiTool: 'stable-diffusion',
    tags: ['sci-fi', 'concept-art', 'cyberpunk', 'space'], trendingScore: 91, likeCount: 678,
  },

  // ──────────────── VIDEO / script ────────────────
  {
    title: 'YouTube Video Script Writer',
    content: `Write a compelling YouTube video script for a [LENGTH]-minute video about [TOPIC].\n\nChannel niche: [YOUR NICHE]\nTarget audience: [AUDIENCE]\nVideo goal: [educate/entertain/sell]\n\nInclude:\n- Hook (first 30 seconds that stops scrolling)\n- B-roll suggestions in [brackets]\n- Natural transitions between sections\n- Engagement prompts (like, subscribe, comment)\n- Strong ending with CTA\n\nTone: [conversational/educational/entertaining]\nMake it sound natural when spoken aloud.`,
    generationType: 'video', category: 'script', aiTool: 'chatgpt',
    tags: ['youtube', 'script', 'video', 'content'], trendingScore: 94, likeCount: 678,
  },
  {
    title: 'Short Film Screenplay',
    content: `Write a [LENGTH]-minute short film screenplay in proper format.\n\nGenre: [GENRE]\nTheme: [CENTRAL THEME]\nCharacters: [BRIEF CHARACTER DESCRIPTIONS]\nSetting: [TIME/PLACE]\nCore conflict: [MAIN TENSION]\n\nInclude:\n- Proper screenplay formatting (INT./EXT., action lines, dialogue)\n- Three-act structure\n- Subtext in dialogue\n- Visual storytelling (show don't tell)\n- Cinematic scene descriptions\n- Emotional arc`,
    generationType: 'video', category: 'script', aiTool: 'claude',
    tags: ['screenplay', 'short-film', 'cinema'], trendingScore: 88, likeCount: 456,
  },
  {
    title: 'TED Talk Script Structure',
    content: `Write a [TIME]-minute TED-style talk on [TOPIC].\n\nSpeaker background: [YOUR EXPERTISE]\nCore idea: [THE ONE BIG IDEA]\nAudience: [WHO WILL WATCH]\n\nStructure:\n- Opening story or shocking statement (2 min)\n- The problem (2 min)\n- Your insight/solution (core content)\n- Evidence and examples\n- Emotional moment\n- Call to action\n- Memorable closing line\n\nUse rhetorical devices, rule of three, and vary sentence length for rhythm.`,
    generationType: 'video', category: 'script', aiTool: 'chatgpt',
    tags: ['ted-talk', 'speech', 'presentation'], trendingScore: 90, likeCount: 534,
  },

  // ──────────────── VIDEO / social ────────────────
  {
    title: 'TikTok/Reels Hook Generator',
    content: `Generate 20 viral TikTok/Reels hook scripts for [TOPIC/NICHE].\n\nTarget audience: [DEMOGRAPHIC]\nContent type: [EDUCATIONAL/ENTERTAINMENT/LIFESTYLE]\nGoal: [FOLLOWS/VIEWS/SALES]\n\nFor each hook:\n- Opening line (first 3 seconds)\n- Visual action suggestion\n- Why it stops scroll\n\nHook types: Question, Bold statement, Controversy, Story start, Secret/Hack, Transformation, Mistake revelation`,
    generationType: 'video', category: 'social', aiTool: 'chatgpt',
    tags: ['tiktok', 'reels', 'hook', 'viral'], trendingScore: 96, likeCount: 892,
  },
  {
    title: 'Instagram Reel Story Arc',
    content: `Create a 60-second Instagram Reel script for [TOPIC].\n\nAccount type: [PERSONAL BRAND/BUSINESS]\nNiche: [YOUR NICHE]\nCall-to-action: [FOLLOW/SAVE/COMMENT/BUY]\n\nScript format:\n- Hook (0-3 sec): [SCROLL-STOPPING ACTION]\n- Problem (3-10 sec): [RELATABLE PAIN POINT]\n- Content/Value (10-50 sec): [MAIN VALUE WITH B-ROLL NOTES]\n- Payoff (50-55 sec): [RESULT OR REVEAL]\n- CTA (55-60 sec): [CLEAR ACTION]\n\nCaption and hashtag strategy included.`,
    generationType: 'video', category: 'social', aiTool: 'chatgpt',
    tags: ['instagram', 'reel', 'social-media', 'content'], trendingScore: 91, likeCount: 712,
  },
  {
    title: 'Podcast Episode Outline',
    content: `Create a structured outline for a [LENGTH]-minute podcast episode on [TOPIC].\n\nShow format: [SOLO/INTERVIEW/CO-HOST]\nAudience: [WHO LISTENS]\nKey message: [WHAT LISTENERS TAKE AWAY]\n\nOutline:\n- Cold open teaser (30 sec)\n- Intro music cue\n- Host intro and episode framing (2 min)\n- Main content sections (time-stamped)\n- Story or interview questions\n- Sponsor segment placement\n- Listener Q&A segment\n- Key takeaways summary\n- Outro and next episode tease`,
    generationType: 'video', category: 'social', aiTool: 'claude',
    tags: ['podcast', 'content', 'audio', 'outline'], trendingScore: 85, likeCount: 423,
  },

  // ──────────────── VIDEO / animation ────────────────
  {
    title: 'Explainer Video Script',
    content: `Write a 90-second animated explainer video script for [PRODUCT/SERVICE].\n\nTone: [FRIENDLY/PROFESSIONAL/PLAYFUL]\nTarget viewer: [PERSONA]\nCore message: [ONE SENTENCE]\n\nScript sections:\n- Problem hook (0-15s): Relatable situation\n- Solution intro (15-30s): Product reveal\n- How it works (30-70s): 3 key features with visuals\n- Social proof (70-80s): Stats or testimonial\n- CTA (80-90s): Clear next step\n\nInclude: Voice-over text, on-screen text suggestions, animation notes in [brackets]`,
    generationType: 'video', category: 'animation', aiTool: 'chatgpt',
    tags: ['explainer', 'animation', 'saas', 'video-script'], trendingScore: 92, likeCount: 567,
  },
  {
    title: 'Motion Graphics Concept Brief',
    content: `Create a motion graphics concept brief for [PROJECT TYPE].\n\nClient: [BRAND]\nDuration: [SECONDS]\nPlatform: [TV/ONLINE/APP]\nStyle: [FLAT 2D/3D/MIXED MEDIA]\nMood: [ADJECTIVES]\n\nBrief includes:\n- Visual style guide\n- Animation principles to use (easing, anticipation)\n- Color story and typography\n- Music/sound design direction\n- Frame-by-frame scene breakdown\n- Technical specs\n- Reference mood board descriptions`,
    generationType: 'video', category: 'animation', aiTool: 'claude',
    tags: ['motion-graphics', 'animation', 'design-brief'], trendingScore: 82, likeCount: 312,
  },

  // ──────────────── DEVELOPMENT / frontend ────────────────
  {
    title: 'React Component Builder',
    content: `Create a production-ready React component with these specs:\n\nComponent name: [NAME]\nPurpose: [WHAT IT DOES]\nProps needed: [LIST PROPS]\nState management: [local state/context/zustand/redux]\nStyling: [Tailwind CSS/CSS modules/styled-components]\n\nRequirements:\n- TypeScript with proper interfaces\n- Accessibility (ARIA labels, keyboard nav)\n- Error boundary handling\n- Loading states\n- Mobile responsive\n- Unit tests with React Testing Library\n- JSDoc comments`,
    generationType: 'development', category: 'frontend', aiTool: 'claude',
    tags: ['react', 'typescript', 'component', 'frontend'], trendingScore: 95, likeCount: 745,
  },
  {
    title: 'Next.js App Router Page',
    content: `Build a Next.js 14 App Router page for [PAGE PURPOSE].\n\nRoute: /[ROUTE]\nData: [SERVER/CLIENT COMPONENT]\nData source: [API/DATABASE]\n\nImplement:\n- Server Component for data fetching\n- Loading.tsx skeleton UI\n- Error.tsx error boundary\n- TypeScript types\n- Metadata for SEO\n- Responsive layout with Tailwind\n- Suspense boundaries\n\nInclude both page.tsx and required sub-components.`,
    generationType: 'development', category: 'frontend', aiTool: 'claude',
    tags: ['nextjs', 'react', 'app-router', 'typescript'], trendingScore: 93, likeCount: 678,
  },
  {
    title: 'CSS Animation Master',
    content: `Create smooth CSS animations for [ELEMENT/INTERACTION].\n\nEffect: [WHAT SHOULD ANIMATE]\nTrigger: [HOVER/SCROLL/CLICK/PAGE LOAD]\nDuration: [FAST 0.2s/MEDIUM 0.5s/SLOW 1s]\nEasing: [ease/spring/bounce]\n\nProvide:\n- Pure CSS keyframe animation\n- CSS custom properties for easy customization\n- JavaScript enhancement for scroll-triggered version\n- Performance-optimized (transform/opacity only)\n- Browser compatibility notes\n- Reduced-motion media query`,
    generationType: 'development', category: 'frontend', aiTool: 'chatgpt',
    tags: ['css', 'animation', 'ui', 'frontend'], trendingScore: 88, likeCount: 512,
  },
  {
    title: 'TypeScript Interface Designer',
    content: `Design TypeScript interfaces and types for [FEATURE/DOMAIN].\n\nDomain: [WHAT IT MODELS]\nOperations: [CRUD/SEARCH/etc.]\nAPI format: [REST/GraphQL]\n\nCreate:\n- Entity interfaces with JSDoc comments\n- Union types for status/enums\n- Generic utility types\n- API request/response types\n- Zod validation schemas\n- Type guards\n- Discriminated unions where appropriate\n\nFollow TypeScript best practices and strict mode compatibility.`,
    generationType: 'development', category: 'frontend', aiTool: 'claude',
    tags: ['typescript', 'types', 'interfaces', 'zod'], trendingScore: 87, likeCount: 456,
  },

  // ──────────────── DEVELOPMENT / backend ────────────────
  {
    title: 'REST API Architecture Designer',
    content: `Design a RESTful API for [FEATURE/SERVICE].\n\nContext:\n- Application type: [WEB/MOBILE/B2B]\n- Scale: [EXPECTED REQUESTS/DAY]\n- Auth: [JWT/SESSION/API KEY]\n\nDesign:\n- Resource naming and URL structure\n- HTTP methods for each endpoint\n- Request/response schemas\n- Status codes and error responses\n- Pagination strategy\n- Rate limiting approach\n- Versioning strategy\n- OpenAPI spec snippet`,
    generationType: 'development', category: 'backend', aiTool: 'claude',
    tags: ['rest-api', 'backend', 'architecture', 'openapi'], trendingScore: 94, likeCount: 623,
  },
  {
    title: 'Node.js Microservice Template',
    content: `Create a production-ready Node.js microservice for [SERVICE PURPOSE].\n\nStack: Express/Fastify + TypeScript\nDatabase: [PostgreSQL/MongoDB/Redis]\nAuth: [JWT middleware]\n\nInclude:\n- Project structure (clean architecture)\n- Environment config with validation\n- Database connection with retry logic\n- Middleware (logging, error handling, rate limiting)\n- Health check endpoint\n- Graceful shutdown\n- Dockerfile\n- Unit test setup\n- GitHub Actions CI snippet`,
    generationType: 'development', category: 'backend', aiTool: 'chatgpt',
    tags: ['nodejs', 'microservice', 'express', 'docker'], trendingScore: 91, likeCount: 534,
  },
  {
    title: 'Senior Code Reviewer',
    content: `Act as a senior software engineer conducting a thorough code review. Review the following code:\n\n\`\`\`[LANGUAGE]\n[YOUR CODE HERE]\n\`\`\`\n\nAnalyze for:\n1. **Bugs & Logic Errors**: Any incorrect behavior\n2. **Security Vulnerabilities**: SQL injection, XSS, etc.\n3. **Performance Issues**: Inefficient algorithms, N+1 queries\n4. **Code Quality**: Readability, naming, SOLID principles\n5. **Test Coverage**: What should be tested\n\nProvide specific line-by-line feedback and suggest improved code snippets.`,
    generationType: 'development', category: 'backend', aiTool: 'claude',
    tags: ['code-review', 'debugging', 'best-practices'], trendingScore: 97, likeCount: 812,
  },

  // ──────────────── DEVELOPMENT / database ────────────────
  {
    title: 'Database Schema Designer',
    content: `Design a normalized database schema for [APPLICATION TYPE].\n\nFeatures to support: [LIST MAIN FEATURES]\nExpected scale: [ROWS/DAY]\nDatabase: [PostgreSQL/MySQL/MongoDB]\n\nProvide:\n- Entity relationship diagram (text-based)\n- CREATE TABLE statements with proper types\n- Primary and foreign key constraints\n- Indexes for common queries\n- Enum types for status fields\n- Soft delete pattern\n- Audit columns (created_at, updated_at)\n- Notes on normalization decisions`,
    generationType: 'development', category: 'database', aiTool: 'chatgpt',
    tags: ['database', 'schema', 'sql', 'design'], trendingScore: 92, likeCount: 567,
  },
  {
    title: 'SQL Query Optimizer',
    content: `Optimize the following SQL query for better performance:\n\n\`\`\`sql\n[YOUR SQL QUERY]\n\`\`\`\n\nDatabase: [MySQL/PostgreSQL]\nTable sizes: [approximate row counts]\nCurrent execution time: [if known]\n\nPlease:\n1. Identify performance bottlenecks\n2. Suggest appropriate indexes\n3. Rewrite the optimized query\n4. Explain each optimization\n5. Show EXPLAIN output analysis\n6. Consider edge cases and NULL handling`,
    generationType: 'development', category: 'database', aiTool: 'chatgpt',
    tags: ['sql', 'optimization', 'performance', 'database'], trendingScore: 90, likeCount: 512,
  },
  {
    title: 'MongoDB Aggregation Pipeline',
    content: `Build a MongoDB aggregation pipeline for [DATA ANALYSIS GOAL].\n\nCollection: [COLLECTION NAME]\nSample document structure:\n[PASTE SAMPLE JSON]\n\nRequired output: [DESCRIBE DESIRED RESULT]\nFilters: [DATE RANGE/STATUS/etc.]\n\nCreate pipeline with:\n- $match stage (indexed fields first)\n- $lookup for joins if needed\n- $group with accumulators\n- $project to shape output\n- Performance optimization tips\n- Index recommendations`,
    generationType: 'development', category: 'database', aiTool: 'claude',
    tags: ['mongodb', 'aggregation', 'nosql', 'pipeline'], trendingScore: 87, likeCount: 423,
  },

  // ──────────────── DEVELOPMENT / devops ────────────────
  {
    title: 'Dockerfile Best Practices',
    content: `Create an optimized Dockerfile for [APPLICATION TYPE].\n\nLanguage/Runtime: [NODE/PYTHON/GO/JAVA]\nApp type: [WEB SERVER/WORKER/CLI]\nEnvironment: [DEVELOPMENT/PRODUCTION]\n\nApply:\n- Multi-stage build to minimize image size\n- Non-root user for security\n- Layer caching optimization\n- .dockerignore file\n- Health check instruction\n- Environment variable handling\n- Signal handling for graceful shutdown\n\nInclude docker-compose.yml for local development.`,
    generationType: 'development', category: 'devops', aiTool: 'chatgpt',
    tags: ['docker', 'dockerfile', 'devops', 'containers'], trendingScore: 93, likeCount: 678,
  },
  {
    title: 'GitHub Actions CI/CD Pipeline',
    content: `Create a GitHub Actions workflow for [PROJECT TYPE].\n\nTriggers: [PUSH TO MAIN/PR/TAGS]\nTests: [UNIT/INTEGRATION/E2E]\nDeployment target: [VERCEL/AWS/GCP/KUBERNETES]\n\nWorkflow should:\n- Cache dependencies\n- Run linting and type checking\n- Execute test suite with coverage\n- Build Docker image\n- Security scan (Snyk or Trivy)\n- Deploy on success\n- Notify on failure (Slack/email)\n\nInclude secrets management best practices.`,
    generationType: 'development', category: 'devops', aiTool: 'claude',
    tags: ['github-actions', 'ci-cd', 'devops', 'automation'], trendingScore: 91, likeCount: 589,
  },
  {
    title: 'Kubernetes Deployment Config',
    content: `Create Kubernetes manifests for deploying [APPLICATION].\n\nApp type: [WEB/API/WORKER]\nReplicas: [NUMBER]\nResources: [CPU/MEMORY LIMITS]\nEnvironment: [STAGING/PRODUCTION]\n\nInclude:\n- Deployment with rolling update strategy\n- Service (ClusterIP/LoadBalancer)\n- ConfigMap and Secrets\n- HorizontalPodAutoscaler\n- Liveness and readiness probes\n- Resource requests and limits\n- PodDisruptionBudget\n- Ingress with TLS (nginx)\n\nNamespace and RBAC best practices included.`,
    generationType: 'development', category: 'devops', aiTool: 'chatgpt',
    tags: ['kubernetes', 'k8s', 'deployment', 'devops'], trendingScore: 89, likeCount: 512,
  },

  // ──────────────── other per type ────────────────
  {
    title: 'General Purpose Text Prompt',
    content: `You are an expert assistant. Please help me with the following task:\n\n[DESCRIBE YOUR TASK IN DETAIL]\n\nContext:\n- Background: [RELEVANT CONTEXT]\n- Goal: [DESIRED OUTCOME]\n- Constraints: [ANY LIMITATIONS]\n- Format: [HOW YOU WANT THE RESPONSE]\n\nPlease be thorough, accurate, and actionable in your response.`,
    generationType: 'text', category: 'other', aiTool: 'chatgpt',
    tags: ['general', 'assistant', 'task'], trendingScore: 75, likeCount: 187,
  },
  {
    title: 'Creative Image Generation Prompt',
    content: `[SUBJECT], [STYLE] style, [LIGHTING DESCRIPTION], [COLOR PALETTE], [COMPOSITION], [MOOD/ATMOSPHERE], [TECHNICAL DETAILS: camera/lens/render engine], [QUALITY MODIFIERS: 8K/ultra-detailed/award-winning], [ARTIST REFERENCE if applicable]`,
    generationType: 'image', category: 'other', aiTool: 'midjourney',
    tags: ['image', 'general', 'template'], trendingScore: 78, likeCount: 234,
  },
  {
    title: 'Video Content Concept Generator',
    content: `Generate [NUMBER] video content ideas for [CHANNEL/BRAND] in the [NICHE] space.\n\nTarget audience: [DEMOGRAPHICS]\nPlatform: [YOUTUBE/TIKTOK/INSTAGRAM]\nContent goals: [VIEWS/SUBSCRIBERS/SALES]\n\nFor each idea:\n- Title (click-worthy)\n- Concept in 2 sentences\n- Hook for first 10 seconds\n- Key talking points\n- Estimated performance potential (low/med/high)\n- Production complexity`,
    generationType: 'video', category: 'other', aiTool: 'chatgpt',
    tags: ['video', 'content-ideas', 'youtube', 'strategy'], trendingScore: 80, likeCount: 267,
  },
  {
    title: 'General Dev Problem Solver',
    content: `I need help solving this development problem:\n\n**Problem:** [DESCRIBE THE ISSUE CLEARLY]\n\n**Tech Stack:**\n- Language: [LANGUAGE + VERSION]\n- Framework: [FRAMEWORK]\n- Environment: [LOCAL/CLOUD/DOCKER]\n\n**What I tried:**\n[LIST ATTEMPTS]\n\n**Error (if any):**\n\`\`\`\n[PASTE ERROR]\n\`\`\`\n\nPlease provide: root cause analysis, solution, and how to prevent it.`,
    generationType: 'development', category: 'other', aiTool: 'claude',
    tags: ['debugging', 'problem-solving', 'development'], trendingScore: 85, likeCount: 356,
  },
];

async function main() {
  if (!MONGO_URI) {
    console.error('MONGODB_URI not set in .env.local');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db!;
  const collection = db.collection('prompts');

  // Delete all existing prompts
  const deleteResult = await collection.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} existing prompts`);

  // Insert new prompts
  const docs = PROMPTS.map((p) => ({
    ...p,
    author: SEED_USER._id,
    authorName: SEED_USER.authorName,
    authorUsername: SEED_USER.authorUsername,
    slug: slug(p.title),
    status: 'active',
    commentCount: 0,
    bookmarkCount: Math.floor(p.likeCount * 0.3),
    viewCount: p.likeCount * 8 + Math.floor(Math.random() * 500),
    copyCount: Math.floor(p.likeCount * 1.2),
    reportCount: 0,
    resultImages: [],
    tags: p.tags,
    language: 'en',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));

  const result = await collection.insertMany(docs);
  console.log(`Inserted ${result.insertedCount} prompts`);

  // Summary by generationType
  const summary = docs.reduce((acc, d) => {
    const key = `${d.generationType}/${d.category}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('\nPrompts by generationType/category:');
  Object.entries(summary).sort().forEach(([k, v]) => console.log(`  ${k}: ${v}`));

  await mongoose.disconnect();
  console.log('\nDone!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
