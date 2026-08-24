import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { products } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { buildVideoPrompt } from '../../../lib/video-gen/prompt';
import { generateVeoVideo } from '../../../lib/video-gen/veo';
import { getSystemSettings } from '../../../lib/settings';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    let productIdList: string[] = [];
    let coverImage = '';

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (Array.isArray(body.productIds)) {
        productIdList = body.productIds;
      } else if (body.productId) {
        productIdList = [body.productId];
      }
      if (body.coverImage) coverImage = body.coverImage;
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const pId = formData.get('productId') as string;
      const pIds = formData.get('productIds') as string;
      if (pIds) {
        productIdList = pIds.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (pId) {
        productIdList = [pId];
      }
      coverImage = (formData.get('coverImage') as string) || '';
    } else {
      try {
        const body = await request.json();
        if (Array.isArray(body.productIds)) productIdList = body.productIds;
        else if (body.productId) productIdList = [body.productId];
      } catch (e) {}
    }

    if (productIdList.length === 0) {
      return NextResponse.json({ error: 'At least one Product ID is required' }, { status: 400 });
    }

    const settings = await getSystemSettings();
    const isMockMode = settings.ai_mode === 'mock';

    const processed = [];
    for (const productId of productIdList) {
      try {
        const item = await db.select().from(products).where(eq(products.id, productId));
        if (item.length > 0) {
          const prod = item[0];
          const types = JSON.parse(prod.filamentTypes || '[]');
          const colors = JSON.parse(prod.filamentColors || '[]');
          const prompt = buildVideoPrompt(prod.title, types, colors);

          const imgToUse = coverImage || prod.selectedCoverImage || '';

          // Call Veo 3 Video AI Generator (Mock / Live mode from settings)
          await generateVeoVideo(productId, imgToUse, prompt, { mock: isMockMode });
          processed.push(productId);
        }
      } catch (err: any) {
        console.error(`[Video Route Error] Product ${productId} failed:`, err.message);
      }
    }

    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/studio', request.url));
    }

    return NextResponse.json({
      success: true,
      message: `Đã khởi tạo tiến trình sinh Video AI cho ${processed.length} mẫu thành công!`,
      processedProductIds: processed,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Video generation failed',
    }, { status: 200 });
  }
}
