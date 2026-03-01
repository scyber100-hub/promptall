import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Collection from '@/models/Collection';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    await connectDB();
    const collection = await Collection.findOne({ slug })
      .populate('owner', 'name username image')
      .lean();

    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const c = collection as any;
    if (!c.isPublic) {
      const session = await getServerSession(authOptions);
      if (!session?.user || (session.user as any).id !== c.owner._id.toString()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json({
      collection: {
        ...c,
        _id: c._id.toString(),
        owner: { ...c.owner, _id: c.owner._id.toString() },
        prompts: c.prompts.map((id: any) => id.toString()),
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const collection = await Collection.findOne({ slug });
    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (collection.owner.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, description, isPublic } = await req.json();
    if (title !== undefined) collection.title = title.trim();
    if (description !== undefined) collection.description = description?.trim();
    if (isPublic !== undefined) collection.isPublic = isPublic;
    await collection.save();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const collection = await Collection.findOne({ slug });
    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (collection.owner.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Collection.deleteOne({ _id: collection._id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
