import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Collection from '@/models/Collection';
import Prompt from '@/models/Prompt';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    await connectDB();
    const collection = await Collection.findOne({ slug }).lean();
    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const c = collection as any;
    if (!c.isPublic) {
      const session = await getServerSession(authOptions);
      if (!session?.user || (session.user as any).id !== c.owner.toString()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const rawPrompts = await Prompt.find({ _id: { $in: c.prompts }, status: 'active' })
      .sort({ createdAt: -1 })
      .lean();

    const prompts = rawPrompts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: p.author?.toString() ?? null,
      resultImages: p.resultImages ?? [],
      viewCount: p.viewCount ?? 0,
      createdAt: p.createdAt?.toISOString() ?? '',
      updatedAt: p.updatedAt?.toISOString() ?? '',
    }));

    return NextResponse.json({ prompts });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { promptId } = await req.json();
    if (!promptId) return NextResponse.json({ error: 'promptId is required' }, { status: 400 });

    await connectDB();
    const collection = await Collection.findOne({ slug });
    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (collection.owner.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const pid = new mongoose.Types.ObjectId(promptId);
    const alreadyIn = collection.prompts.some((p) => p.toString() === promptId);
    if (alreadyIn) {
      // remove
      collection.prompts = collection.prompts.filter((p) => p.toString() !== promptId);
      collection.promptCount = Math.max(0, collection.promptCount - 1);
      await collection.save();
      return NextResponse.json({ added: false });
    } else {
      collection.prompts.push(pid);
      collection.promptCount = collection.prompts.length;
      await collection.save();
      return NextResponse.json({ added: true });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
