import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const prompt = await Prompt.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { slug: id }],
      status: 'active',
    }).lean();

    if (!prompt) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Increment view count
    await Prompt.findByIdAndUpdate((prompt as any)._id, { $inc: { viewCount: 1 } });

    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const prompt = await Prompt.findById(id);
    if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (prompt.author.toString() !== userId && role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, description, aiTool, category, tags, resultText, resultImages } = body;

    const updated = await Prompt.findByIdAndUpdate(
      id,
      { title, content, description, aiTool, category, tags, resultText, resultImages },
      { new: true }
    );

    return NextResponse.json({ prompt: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const prompt = await Prompt.findById(id);
    if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (prompt.author.toString() !== userId && role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Prompt.findByIdAndUpdate(id, { status: 'deleted' });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
