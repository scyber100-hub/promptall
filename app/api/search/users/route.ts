import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() ?? '';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1);
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') ?? '20') || 20));

    if (!q) {
      return NextResponse.json({ users: [], total: 0, page: 1, pages: 0 });
    }

    await connectDB();

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    const query = {
      $or: [{ name: regex }, { username: regex }],
      status: 'active',
    };

    const [rawUsers, total] = await Promise.all([
      User.find(query)
        .select('_id name username image bio followerCount promptCount')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const users = rawUsers.map((u: any) => ({
      ...u,
      _id: u._id.toString(),
    }));

    return NextResponse.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/search/users error:', error);
    return NextResponse.json({ users: [], total: 0, page: 1, pages: 0 });
  }
}
