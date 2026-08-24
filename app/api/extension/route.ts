import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { searchJobs, products } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      return NextResponse.json({ success: true, connected: true });
    }

    // Extension Polling for Pending Search Jobs
    if (action === 'poll') {
      const pendingJobs = await db
        .select()
        .from(searchJobs)
        .where(eq(searchJobs.status, 'PENDING'))
        .limit(1);

      if (pendingJobs.length > 0) {
        const job = pendingJobs[0];
        await db
          .update(searchJobs)
          .set({ status: 'RUNNING' })
          .where(eq(searchJobs.id, job.id));

        return NextResponse.json({
          job: {
            jobId: job.id,
            keyword: job.keyword,
            maxResults: job.maxResults,
          },
        });
      }

      return NextResponse.json({ job: null });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, jobId, hits, error } = body;

    if (action === 'completeJob' && jobId && Array.isArray(hits)) {
      console.log(`[Extension API] Received ${hits.length} products for Job ${jobId}`);
      const now = new Date().toISOString();

      for (const hit of hits) {
        const modelId = String(hit.makerworldId);
        const coverImg = hit.coverUrl || null;
        const existing = await db.select().from(products).where(eq(products.makerworldId, modelId));

        if (existing.length === 0) {
          await db.insert(products).values({
            id: `prod-${modelId}`,
            makerworldId: modelId,
            title: hit.title,
            url: hit.url,
            author: hit.author || 'MakerWorld Creator',
            filamentTypes: JSON.stringify(['PLA Silk', 'PETG']),
            filamentColors: JSON.stringify(['Gold', 'Black']),
            printTimeMinutes: hit.printTimeMinutes || 120,
            weightGrams: hit.weightGrams || 50,
            status: 'CRAWLED',
            rawImages: JSON.stringify(coverImg ? [coverImg] : []),
            selectedCoverImage: coverImg,
            createdAt: now,
            updatedAt: now,
          });
        } else {
          await db.update(products).set({
            title: hit.title,
            url: hit.url,
            author: hit.author || 'MakerWorld Creator',
            rawImages: JSON.stringify(coverImg ? [coverImg] : []),
            selectedCoverImage: coverImg,
            updatedAt: now,
          }).where(eq(products.makerworldId, modelId));
        }
      }

      // Update Search Job Status
      await db.update(searchJobs).set({
        status: 'COMPLETED',
        itemsFound: hits.length,
      }).where(eq(searchJobs.id, jobId));

      return NextResponse.json({ success: true, message: `Saved ${hits.length} items.` });
    }

    if (action === 'failJob' && jobId) {
      await db.update(searchJobs).set({
        status: 'FAILED',
      }).where(eq(searchJobs.id, jobId));

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid POST payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
