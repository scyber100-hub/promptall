import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Prompt from '@/models/Prompt';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = 12;
  const skip = (page - 1) * limit;

  try {
    await connectDB();
    const user = await User.findOne({ username }).select('_id').lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const [raws, total] = await Promise.all([
      Prompt.find({ author: (user as any)._id, status: 'active' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title description aiTool category resultImages authorName authorUsername likeCount commentCount viewCount createdAt slug')
        .lean(),
      Prompt.countDocuments({ author: (user as any)._id, status: 'active' }),
    ]);

    const prompts = raws.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      resultImages: p.resultImages ?? [],
      createdAt: p.createdAt?.toISOString() ?? '',
      slug: p.slug ?? p._id.toString(),
    }));

    return NextResponse.json({ prompts, total, hasMore: skip + limit < total });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
