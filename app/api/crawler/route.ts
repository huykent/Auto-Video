import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { searchJobs } from '../../../lib/db/schema';
import { crawlerQueue } from '../../../lib/queue';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const jobs = await db.select().from(searchJobs).orderBy(desc(searchJobs.createdAt)).limit(20);
    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let rawKeywords = '';
    let maxResults = 10;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      rawKeywords = body.keyword || '';
      maxResults = Number(body.maxResults || 10);
    } else {
      const formData = await request.formData();
      rawKeywords = (formData.get('keyword') as string) || '';
      maxResults = Number(formData.get('maxResults') || 10);
    }

    if (!rawKeywords) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    const keywordList = rawKeywords.split(',').map((k) => k.trim()).filter(Boolean);
    const createdJobs = [];

    for (const kw of keywordList) {
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      await db.insert(searchJobs).values({
        id: jobId,
        keyword: kw,
        maxResults,
        status: 'PENDING',
        itemsFound: 0,
        createdAt: now,
      });

      await crawlerQueue.add('crawl-keyword', { jobId, keyword: kw, maxResults });
      createdJobs.push(jobId);
    }

    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/discovery', request.url));
    }

    return NextResponse.json({ success: true, jobIds: createdJobs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
