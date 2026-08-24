import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '../../../../lib/db';
import { products } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || searchParams.get('id') || '';
    const filePathParam = searchParams.get('path') || '';

    let targetPath = '';

    if (productId) {
      const item = await db.select().from(products).where(eq(products.id, productId));
      if (item.length > 0 && item[0].generatedVideoPath && !item[0].generatedVideoPath.startsWith('/api/') && !item[0].generatedVideoPath.startsWith('file?')) {
        targetPath = item[0].generatedVideoPath;
      } else {
        targetPath = path.resolve(process.cwd(), 'storage/generated_videos', `${productId}.mp4`);
      }
    } else if (filePathParam) {
      targetPath = filePathParam;
    }

    if (!targetPath || !fs.existsSync(targetPath)) {
      const fileName = path.basename(targetPath || `${productId}.mp4`);
      targetPath = path.resolve(process.cwd(), 'storage/generated_videos', fileName);
    }

    if (!fs.existsSync(targetPath)) {
      targetPath = path.resolve(process.cwd(), 'storage/generated_videos/sample_demo.mp4');
    }

    if (fs.existsSync(targetPath)) {
      const stat = fs.statSync(targetPath);
      const fileBuffer = fs.readFileSync(targetPath);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': stat.size.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return new NextResponse('Video file not found', { status: 404 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
