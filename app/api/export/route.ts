import { NextResponse } from 'next/server';
import { exportProductPackage } from '../../../lib/exporter/packager';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId') as string;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await exportProductPackage(productId);

    return NextResponse.redirect(new URL('/exports', request.url));
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 });
  }
}
