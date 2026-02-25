import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import Like from '@/models/Like';
import Bookmark from '@/models/Bookmark';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Aggregate weekly likes per prompt
    const weeklyLikes = await Like.aggregate([
      { $match: { targetType: 'prompt', createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$targetId', count: { $sum: 1 } } },
    ]);

    // Aggregate weekly bookmarks per prompt
    const weeklyBookmarks = await Bookmark.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$promptId', count: { $sum: 1 } } },
    ]);

    const likesMap = new Map(weeklyLikes.map((l) => [l._id.toString(), l.count]));
    const bookmarksMap = new Map(weeklyBookmarks.map((b) => [b._id.toString(), b.count]));

    // Fetch all active prompts with current stats
    const prompts = await Prompt.find({ status: 'active' }).select('_id viewCount copyCount').lean();

    // Bulk update trendingScore for each prompt
    const bulkOps = prompts.map((p: any) => {
      const id = p._id.toString();
      const wLikes = likesMap.get(id) ?? 0;
      const wBookmarks = bookmarksMap.get(id) ?? 0;
      const score = wLikes * 3 + wBookmarks * 2 + p.viewCount * 0.05 + p.copyCount * 0.5;
      return {
        updateOne: {
          filter: { _id: p._id },
          update: { $set: { trendingScore: Math.round(score * 100) / 100 } },
        },
      };
    });

    if (bulkOps.length > 0) {
      await Prompt.bulkWrite(bulkOps);
    }

    return NextResponse.json({ updated: bulkOps.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[cron/trending] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
