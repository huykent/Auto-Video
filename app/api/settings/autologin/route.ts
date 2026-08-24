import { NextResponse } from 'next/server';
import { autoLoginMakerWorld } from '../../../../lib/crawler/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, verificationCode } = body;

    const result = await autoLoginMakerWorld(email, password, verificationCode);
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
