import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import User from '@/models/User';
import { AdminConsole } from '@/components/admin/AdminConsole';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect(`/${locale}`);
  }

  await connectDB();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [rawPrompts, rawUsers, totalUsers, totalPrompts, newUsersToday, reportedPrompts] = await Promise.all([
    Prompt.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select('title status reportCount authorUsername createdAt likeCount viewCount slug')
      .lean(),
    User.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select('name username email role status promptCount createdAt')
      .lean(),
    User.countDocuments({}),
    Prompt.countDocuments({ status: 'active' }),
    User.countDocuments({ createdAt: { $gte: todayStart } }),
    Prompt.countDocuments({ reportCount: { $gt: 0 }, status: 'active' }),
  ]);

  const prompts = rawPrompts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString() ?? '',
  }));

  const users = rawUsers.map((u: any) => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt?.toISOString() ?? '',
  }));

  const stats = { totalUsers, totalPrompts, newUsersToday, reportedPrompts };

  return <AdminConsole initialPrompts={prompts} initialUsers={users} stats={stats} />;
}
