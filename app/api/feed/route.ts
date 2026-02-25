import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Follow from '@/models/Follow';
import Prompt from '@/models/Prompt';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 12;

    await connectDB();
    const userId = (session.user as any).id;

    // Find all users this person follows
    const follows = await Follow.find({ follower: userId }).select('following').lean();
    const followingIds = follows.map((f) => f.following);

    if (followingIds.length === 0) {
      return NextResponse.json({ prompts: [], total: 0, page, pages: 0 });
    }

    // Get their authorIds from User collection
    const followingUsers = await User.find({ _id: { $in: followingIds } }).select('_id').lean();
    const authorIds = followingUsers.map((u) => u._id);

    const query = { status: 'active', author: { $in: authorIds } };
    const [rawPrompts, total] = await Promise.all([
      Prompt.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Prompt.countDocuments(query),
    ]);

    const prompts = rawPrompts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: p.author?.toString() ?? null,
      resultImages: p.resultImages ?? [],
      createdAt: p.createdAt?.toISOString() ?? '',
      updatedAt: p.updatedAt?.toISOString() ?? '',
    }));

    return NextResponse.json({ prompts, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
