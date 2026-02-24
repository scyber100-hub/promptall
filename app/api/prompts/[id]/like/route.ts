import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Like from '@/models/Like';
import Prompt from '@/models/Prompt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;

    const existing = await Like.findOne({
      userId,
      targetId: id,
      targetType: 'prompt',
    });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      await Prompt.findByIdAndUpdate(id, { $inc: { likeCount: -1 } });
      return NextResponse.json({ liked: false });
    } else {
      await Like.create({ userId, targetId: id, targetType: 'prompt' });
      await Prompt.findByIdAndUpdate(id, { $inc: { likeCount: 1 } });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
