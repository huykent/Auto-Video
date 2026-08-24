import { NextResponse } from 'next/server';
import { exportProductPackage } from '../../../lib/exporter/packager';

export const dynamic = 'force-dynamic';

function getSafeRedirectUrl(request: Request, path: string): string {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  if (host && !host.startsWith('localhost:')) {
    return `${proto}://${host}${path}`;
  }
  return new URL(path, request.url).toString();
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let productId = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      productId = body.productId;
    } else {
      const formData = await request.formData();
      productId = (formData.get('productId') as string) || '';
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await exportProductPackage(productId);

    if (contentType.includes('application/json')) {
      return NextResponse.json({ success: true, redirectUrl: '/exports' });
    }

    return NextResponse.redirect(getSafeRedirectUrl(request, '/exports'));
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 });
  }
}
