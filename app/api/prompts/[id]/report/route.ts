import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Report from '@/models/Report';
import Prompt from '@/models/Prompt';
import Notification from '@/models/Notification';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const { reason } = body;

    if (!['spam', 'inappropriate', 'copyright', 'other'].includes(reason)) {
      return NextResponse.json({ error: 'Invalid reason' }, { status: 400 });
    }

    const prompt = await Prompt.findById(id);
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    // 로그인 사용자 중복 신고 방지
    if (userId) {
      const existing = await Report.findOne({ promptId: id, userId });
      if (existing) {
        return NextResponse.json({ error: 'Already reported' }, { status: 409 });
      }
    }

    await Report.create({
      promptId: id,
      userId: userId || undefined,
      reason,
    });

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { reportCount: 1 } },
      { new: true }
    );

    // 신고 5회 이상이면 자동 숨김
    if (updatedPrompt && updatedPrompt.reportCount >= 5 && updatedPrompt.status === 'active') {
      await Prompt.findByIdAndUpdate(id, { status: 'hidden' });
      // Admin notification: prompt auto-hidden
      Notification.create({
        type: 'prompt_hidden',
        message: `Prompt "${updatedPrompt.title}" was auto-hidden after ${updatedPrompt.reportCount} reports.`,
        data: { promptId: id, title: updatedPrompt.title, reportCount: updatedPrompt.reportCount },
      }).catch(() => {});
    } else if (updatedPrompt && updatedPrompt.reportCount === 3) {
      // Admin notification: prompt reaching report threshold
      Notification.create({
        type: 'high_report',
        message: `Prompt "${updatedPrompt.title}" has received ${updatedPrompt.reportCount} reports.`,
        data: { promptId: id, title: updatedPrompt.title, reportCount: updatedPrompt.reportCount },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'Already reported' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
