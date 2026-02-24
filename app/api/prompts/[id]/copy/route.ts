import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const updated = await Prompt.findByIdAndUpdate(id, { $inc: { copyCount: 1 } }, { new: true });
    if (updated) {
      await Prompt.findByIdAndUpdate(id, {
        $set: { trendingScore: updated.likeCount * 2 + updated.viewCount * 0.2 + updated.bookmarkCount * 1 },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
