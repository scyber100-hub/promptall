import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bio } = await req.json();

    if (!name || name.trim().length < 1) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (name.trim().length > 50) {
      return NextResponse.json({ error: 'Name must be 50 characters or less' }, { status: 400 });
    }
    if (bio && bio.length > 200) {
      return NextResponse.json({ error: 'Bio must be 200 characters or less' }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    const updated = await User.findByIdAndUpdate(
      userId,
      { name: name.trim(), bio: bio?.trim() ?? '' },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
