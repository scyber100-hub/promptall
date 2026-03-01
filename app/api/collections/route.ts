import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Collection from '@/models/Collection';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
    + '-' + Date.now().toString(36);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, isPublic } = await req.json();
    if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    await connectDB();
    const slug = generateSlug(title);
    const collection = await Collection.create({
      title: title.trim(),
      description: description?.trim(),
      slug,
      owner: (session.user as any).id,
      isPublic: isPublic !== false,
    });

    return NextResponse.json({
      collection: {
        ...collection.toObject(),
        _id: collection._id.toString(),
        owner: collection.owner.toString(),
        createdAt: collection.createdAt.toISOString(),
        updatedAt: collection.updatedAt.toISOString(),
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
