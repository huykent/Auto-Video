import { NextResponse } from 'next/server';
import { scrapeMakerWorldKeyword } from '../../../lib/crawler/makerworld';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const keyword = formData.get('keyword') as string;

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    // Trigger Playwright Scraper
    await scrapeMakerWorldKeyword(keyword, 5);

    return NextResponse.redirect(new URL('/discovery', request.url));
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Scraping failed' }, { status: 500 });
  }
}
