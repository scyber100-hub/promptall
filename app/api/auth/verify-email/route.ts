import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    await connectDB();
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    user.emailVerified = new Date();
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
