import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import User from '@/models/User';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await connectDB();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalUsers, totalPrompts, newUsersToday, reportedPrompts] = await Promise.all([
      User.countDocuments({}),
      Prompt.countDocuments({ status: 'active' }),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      Prompt.countDocuments({ reportCount: { $gt: 0 }, status: 'active' }),
    ]);

    return NextResponse.json({ totalUsers, totalPrompts, newUsersToday, reportedPrompts });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
