import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { products } from '../../../lib/db/schema';
import { desc } from 'drizzle-orm';

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
