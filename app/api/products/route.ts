import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { products } from '../../../lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fetchRealModelDetails, saveProductToDb } from '../../../lib/crawler/makerworld';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const list = await db.select().from(products).orderBy(desc(products.createdAt)).limit(50);
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { productId, selectedCoverImage, rawImages } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updatePayload: any = { updatedAt: new Date().toISOString() };
    if (selectedCoverImage !== undefined) updatePayload.selectedCoverImage = selectedCoverImage;
    if (rawImages !== undefined) updatePayload.rawImages = JSON.stringify(rawImages);

    await db.update(products).set(updatePayload).where(eq(products.id, productId));

    return NextResponse.json({ success: true, message: 'Đã lưu danh sách ảnh được chọn!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawInput = body.urls || body.url || body.input || '';

    let urlList: string[] = [];
    if (Array.isArray(rawInput)) {
      urlList = rawInput;
    } else if (typeof rawInput === 'string') {
      urlList = rawInput.split(/[\n,;]/).map((s: string) => s.trim()).filter(Boolean);
    }

    const modelIds: string[] = [];
    for (const item of urlList) {
      const match = item.match(/\/models\/(\d+)/) || item.match(/^(\d+)$/);
      if (match && match[1]) {
        if (!modelIds.includes(match[1])) {
          modelIds.push(match[1]);
        }
      }
    }

    if (modelIds.length === 0) {
      return NextResponse.json({ error: 'No valid MakerWorld Model URLs or IDs found in input.' }, { status: 400 });
    }

    const ingestedProducts = [];
    for (const mid of modelIds) {
      const realData = await fetchRealModelDetails(mid);
      if (realData) {
        await saveProductToDb(realData);
        ingestedProducts.push(realData);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${ingestedProducts.length} models with authentic metadata & all 4K photos!`,
      products: ingestedProducts
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
