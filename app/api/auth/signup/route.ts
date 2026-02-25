import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const baseUsername = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();

    let username = baseUsername;
    let counter = 0;
    while (await User.findOne({ username })) {
      counter++;
      username = `${baseUsername}${counter}`;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      name,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'email',
      role: 'user',
      verificationToken,
      verificationExpires,
    });

    // Fire-and-forget: don't fail signup if email fails
    sendVerificationEmail(email.toLowerCase(), verificationToken).catch((err) =>
      console.error('Failed to send verification email:', err)
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
