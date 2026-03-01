import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Follow from '@/models/Follow';
import User from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const skip = (page - 1) * limit;

    await connectDB();
    const user = await User.findOne({ username }).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const total = await Follow.countDocuments({ following: (user as any)._id });
    const follows = await Follow.find({ following: (user as any)._id })
      .populate('follower', 'name username image bio followerCount followingCount promptCount')
      .skip(skip)
      .limit(limit)
      .lean();

    const followers = follows.map((f: any) => ({
      ...f.follower,
      _id: f.follower._id.toString(),
    }));

    return NextResponse.json({ followers, total, page, limit });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
