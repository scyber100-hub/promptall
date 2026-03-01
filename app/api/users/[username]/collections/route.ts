import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Collection from '@/models/Collection';
import User from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  try {
    await connectDB();
    const user = await User.findOne({ username }).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const session = await getServerSession(authOptions);
    const isOwner = session?.user && (session.user as any).id === (user as any)._id.toString();

    const filter = isOwner
      ? { owner: (user as any)._id }
      : { owner: (user as any)._id, isPublic: true };

    const rawCollections = await Collection.find(filter).sort({ createdAt: -1 }).lean();

    const collections = rawCollections.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      owner: c.owner.toString(),
      prompts: c.prompts.map((p: any) => p.toString()),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json({ collections });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
