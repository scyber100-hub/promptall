import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Prompt from '@/models/Prompt';
import User from '@/models/User';
import { createNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { promptId, content, parentId } = await req.json();

    if (!promptId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const comment = await Comment.create({
      promptId,
      author: userId,
      authorName: user.name,
      authorUsername: user.username,
      authorImage: user.image,
      content: content.trim(),
      ...(parentId && { parentId }),
    });

    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } });
    } else {
      await Prompt.findByIdAndUpdate(promptId, { $inc: { commentCount: 1 } });
    }

    // 알림 트리거 (fire-and-forget)
    const prompt = await Prompt.findById(promptId).select('author title slug').lean();
    if (prompt) {
      let recipientId: string | undefined;
      if (parentId) {
        const parentComment = await Comment.findById(parentId).select('author').lean();
        recipientId = (parentComment as any)?.author?.toString();
      } else {
        recipientId = (prompt as any).author?.toString();
      }
      if (recipientId) {
        createNotification({
          recipient: recipientId,
          actor: userId,
          actorName: user.name,
          actorUsername: user.username,
          actorImage: user.image ?? undefined,
          type: parentId ? 'comment_reply' : 'comment',
          promptId: promptId,
          promptTitle: (prompt as any).title,
          promptSlug: (prompt as any).slug,
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      comment: {
        _id: comment._id.toString(),
        authorName: comment.authorName,
        authorUsername: comment.authorUsername,
        authorImage: comment.authorImage ?? undefined,
        content: comment.content,
        replyCount: comment.replyCount,
        parentId: comment.parentId?.toString(),
        createdAt: comment.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
