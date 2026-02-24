import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Prompt from '@/models/Prompt';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const comment = await Comment.findById(id);
    if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (comment.author.toString() !== userId && role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Comment.findByIdAndUpdate(id, { status: 'deleted' });

    if (!comment.parentId) {
      await Prompt.findByIdAndUpdate(comment.promptId, { $inc: { commentCount: -1 } });
    } else {
      await Comment.findByIdAndUpdate(comment.parentId, { $inc: { replyCount: -1 } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
