import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Like from '@/models/Like';
import Prompt from '@/models/Prompt';
import User from '@/models/User';
import { createNotification } from '@/lib/notifications';

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
      const updated = await Prompt.findByIdAndUpdate(id, { $inc: { likeCount: -1 } }, { new: true });
      if (updated) {
        await User.findByIdAndUpdate(updated.author, { $inc: { likeCount: -1 } });
        await Prompt.findByIdAndUpdate(id, {
          $set: { trendingScore: updated.likeCount * 2 + updated.viewCount * 0.2 + updated.bookmarkCount * 1 },
        });
      }
      return NextResponse.json({ liked: false });
    } else {
      await Like.create({ userId, targetId: id, targetType: 'prompt' });
      const updated = await Prompt.findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true });
      if (updated) {
        await User.findByIdAndUpdate(updated.author, { $inc: { likeCount: 1 } });
        await Prompt.findByIdAndUpdate(id, {
          $set: { trendingScore: updated.likeCount * 2 + updated.viewCount * 0.2 + updated.bookmarkCount * 1 },
        });
        createNotification({
          recipient: updated.author.toString(),
          actor: userId,
          actorName: (session.user as any).name ?? '',
          actorUsername: (session.user as any).username ?? '',
          actorImage: (session.user as any).image ?? undefined,
          type: 'like',
          promptId: id,
          promptTitle: updated.title,
          promptSlug: updated.slug,
        }).catch(() => {});
      }
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
