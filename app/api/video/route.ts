import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { products } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { buildVideoPrompt } from '../../../lib/video-gen/prompt';
import { generateVeoVideo } from '../../../lib/video-gen/veo';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const coverImage = formData.get('coverImage') as string;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const item = await db.select().from(products).where(eq(products.id, productId));
    if (item.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const prod = item[0];
    const types = JSON.parse(prod.filamentTypes || '[]');
    const colors = JSON.parse(prod.filamentColors || '[]');
    const prompt = buildVideoPrompt(prod.title, types, colors);

    // Call Veo 3 Video AI Generator (Mock / Live mode)
    await generateVeoVideo(productId, coverImage || '', prompt, { mock: true });

    return NextResponse.redirect(new URL('/studio', request.url));
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Video generation failed' }, { status: 500 });
  }
}
