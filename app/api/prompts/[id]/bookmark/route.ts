import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
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

    const existing = await Bookmark.findOne({ userId, promptId: id });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      const updated = await Prompt.findByIdAndUpdate(id, { $inc: { bookmarkCount: -1 } }, { new: true });
      if (updated) {
        await Prompt.findByIdAndUpdate(id, {
          $set: { trendingScore: updated.likeCount * 2 + updated.viewCount * 0.2 + updated.bookmarkCount * 1 },
        });
      }
      return NextResponse.json({ bookmarked: false });
    } else {
      await Bookmark.create({ userId, promptId: id });
      const updated = await Prompt.findByIdAndUpdate(id, { $inc: { bookmarkCount: 1 } }, { new: true });
      if (updated) {
        await Prompt.findByIdAndUpdate(id, {
          $set: { trendingScore: updated.likeCount * 2 + updated.viewCount * 0.2 + updated.bookmarkCount * 1 },
        });
      }
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
