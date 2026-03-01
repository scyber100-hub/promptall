import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');

    const query: Record<string, unknown> = {
      promptId: id,
      status: 'active',
      parentId: parentId ? parentId : { $exists: false },
    };

    const raw = await Comment.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const comments = raw.map((c: any) => ({
      _id: c._id.toString(),
      authorName: c.authorName,
      authorUsername: c.authorUsername,
      authorImage: c.authorImage ?? undefined,
      content: c.content,
      replyCount: c.replyCount ?? 0,
      parentId: c.parentId?.toString(),
      createdAt: c.createdAt?.toISOString() ?? '',
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
