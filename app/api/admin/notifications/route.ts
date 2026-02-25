import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Notification from '@/models/Notification';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const query = unreadOnly ? { read: false } : {};

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({ read: false });
    return NextResponse.json({ notifications, unreadCount });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await connectDB();
    const { ids } = await req.json();

    if (ids === 'all') {
      await Notification.updateMany({}, { $set: { read: true } });
    } else if (Array.isArray(ids)) {
      await Notification.updateMany({ _id: { $in: ids } }, { $set: { read: true } });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
