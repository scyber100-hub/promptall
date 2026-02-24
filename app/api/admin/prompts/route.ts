import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';

async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'admin';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20') || 20));
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
    if (status && ['active', 'hidden', 'deleted'].includes(status)) {
      query.status = status;
    }

    const prompts = await Prompt.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title status reportCount authorUsername createdAt likeCount viewCount')
      .lean();

    const total = await Prompt.countDocuments(query);

    return NextResponse.json({
      prompts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
