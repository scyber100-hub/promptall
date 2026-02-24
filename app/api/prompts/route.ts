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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12') || 12));
    const aiTool = searchParams.get('aiTool');
    const category = searchParams.get('category');
    const generationType = searchParams.get('generationType');
    const sort = searchParams.get('sort') || 'latest';
    const q = searchParams.get('q');
    const username = searchParams.get('username');

    const query: Record<string, unknown> = { status: 'active' };

    if (aiTool && aiTool !== 'all') query.aiTool = aiTool;
    if (generationType && generationType !== 'all') query.generationType = generationType;
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
    const { title, content, description, aiTool, generationType, category, tags, resultText, resultImages, resultLink } = body;

    if (!title || !content || !aiTool || !generationType || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (title.length < 5 || title.length > 80) {
      return NextResponse.json({ error: 'Title must be between 5 and 80 characters' }, { status: 400 });
    }
    if (!description || description.length < 10 || description.length > 160) {
      return NextResponse.json({ error: 'Description must be between 10 and 160 characters' }, { status: 400 });
    }
    if (content.length < 50) {
      return NextResponse.json({ error: 'Content must be at least 50 characters' }, { status: 400 });
    }
    if (Array.isArray(tags) && tags.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 tags allowed' }, { status: 400 });
    }

    const ALLOWED_IMAGE_HOSTS = ['res.cloudinary.com', 'lh3.googleusercontent.com'];
    const validatedImages: string[] = [];
    if (Array.isArray(resultImages)) {
      for (const url of resultImages) {
        try {
          const { hostname } = new URL(url);
          if (ALLOWED_IMAGE_HOSTS.includes(hostname)) {
            validatedImages.push(url);
          }
        } catch {
          // skip invalid URLs
        }
      }
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
      generationType,
      category,
      tags: tags || [],
      resultText,
      resultImages: validatedImages,
      resultLink,
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
