import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    const user = await User.findById(userId).select('-password -verificationToken -verificationExpires').lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...(user as any),
        _id: (user as any)._id.toString(),
        createdAt: (user as any).createdAt?.toISOString() ?? '',
        updatedAt: (user as any).updatedAt?.toISOString() ?? '',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bio, image } = await req.json();

    if (!name || name.trim().length < 1) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (name.trim().length > 50) {
      return NextResponse.json({ error: 'Name must be 50 characters or less' }, { status: 400 });
    }
    if (bio && bio.length > 200) {
      return NextResponse.json({ error: 'Bio must be 200 characters or less' }, { status: 400 });
    }
    if (image && image.length > 500) {
      return NextResponse.json({ error: 'Image URL must be 500 characters or less' }, { status: 400 });
    }
    if (image && image.length > 0 && !/^https?:\/\/.+/.test(image)) {
      return NextResponse.json({ error: 'Image must be a valid URL' }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    const updated = await User.findByIdAndUpdate(
      userId,
      { name: name.trim(), bio: bio?.trim() ?? '', image: image?.trim() ?? '' },
      { new: true }
    ).select('-password -verificationToken -verificationExpires').lean();

    return NextResponse.json({
      user: {
        ...(updated as any),
        _id: (updated as any)._id.toString(),
        createdAt: (updated as any).createdAt?.toISOString() ?? '',
        updatedAt: (updated as any).updatedAt?.toISOString() ?? '',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
