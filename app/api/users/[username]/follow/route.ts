import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Follow from '@/models/Follow';
import User from '@/models/User';

export async function POST(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const followerId = (session.user as any).id;

    const target = await User.findOne({ username }).lean();
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (target._id.toString() === followerId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const existing = await Follow.findOne({ follower: followerId, following: target._id });
    if (existing) {
      await Follow.deleteOne({ _id: existing._id });
      return NextResponse.json({ following: false });
    } else {
      await Follow.create({ follower: followerId, following: target._id });
      return NextResponse.json({ following: true });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ following: false });

    await connectDB();
    const followerId = (session.user as any).id;
    const target = await User.findOne({ username }).lean();
    if (!target) return NextResponse.json({ following: false });

    const exists = await Follow.exists({ follower: followerId, following: target._id });
    return NextResponse.json({ following: !!exists });
  } catch {
    return NextResponse.json({ following: false });
  }
}
