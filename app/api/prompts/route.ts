import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import User from '@/models/User';
import { generateSlug } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const aiTool = searchParams.get('aiTool');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'latest';
    const q = searchParams.get('q');
    const username = searchParams.get('username');

    const query: Record<string, unknown> = { status: 'active' };

    if (aiTool && aiTool !== 'all') query.aiTool = aiTool;
    if (category && category !== 'all') query.category = category;
    if (username) query.authorUsername = username;
    if (q) query.$text = { $search: q };

    const sortMap: Record<string, [string, 1 | -1][]> = {
      latest: [['createdAt', -1]],
      popular: [['likeCount', -1]],
      trending: [['trendingScore', -1]],
    };

    const prompts = await Prompt.find(query)
      .sort(sortMap[sort] || sortMap.latest)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content -resultText')
      .lean();

    const total = await Prompt.countDocuments(query);

    return NextResponse.json({
      prompts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/prompts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { title, content, description, aiTool, category, tags, resultText, resultImages } = body;

    if (!title || !content || !aiTool || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const slug = generateSlug(title);

    const prompt = await Prompt.create({
      title,
      content,
      description,
      aiTool,
      category,
      tags: tags || [],
      resultText,
      resultImages: resultImages || [],
      author: userId,
      authorName: user.name,
      authorUsername: user.username,
      authorImage: user.image,
      slug,
    });

    await User.findByIdAndUpdate(userId, { $inc: { promptCount: 1 } });

    return NextResponse.json({ prompt }, { status: 201 });
  } catch (error) {
    console.error('POST /api/prompts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
