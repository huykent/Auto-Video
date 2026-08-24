import { Worker } from 'bullmq';
import { connection } from '../queue';
import { scrapeMakerWorldKeyword } from '../crawler/makerworld';
import { db } from '../db';
import { searchJobs } from '../db/schema';
import { eq } from 'drizzle-orm';

export function startWorker() {
  const crawlerWorker = new Worker(
    'crawler-queue',
    async (job) => {
      console.log(`[Crawler Worker] Processing job ${job.id}:`, job.data);
      const { jobId, keyword, maxResults } = job.data;

      try {
        if (jobId) {
          await db.update(searchJobs).set({ status: 'RUNNING' }).where(eq(searchJobs.id, jobId));
        }

        const items = await scrapeMakerWorldKeyword(keyword, maxResults || 10);
        
        if (jobId) {
          await db.update(searchJobs).set({ 
            status: 'COMPLETED', 
            itemsFound: items.length 
          }).where(eq(searchJobs.id, jobId));
        }

        return { status: 'completed', jobId: job.id, itemsFound: items.length };
      } catch (err: any) {
        console.error(`[Crawler Worker] Job ${job.id} failed:`, err);
        if (jobId) {
          await db.update(searchJobs).set({ status: 'FAILED' }).where(eq(searchJobs.id, jobId));
        }
        throw err;
      }
    },
    { connection }
  );

  const videoGenWorker = new Worker(
    'video-gen-queue',
    async (job) => {
      console.log(`[Video Gen Worker] Processing job ${job.id}:`, job.data);
      return { status: 'completed', jobId: job.id };
    },
    { connection }
  );

  const exportWorker = new Worker(
    'export-queue',
    async (job) => {
      console.log(`[Export Worker] Processing job ${job.id}:`, job.data);
      return { status: 'completed', jobId: job.id };
    },
    { connection }
  );

  console.log('[BullMQ Engine] All workers started successfully.');
  return { crawlerWorker, videoGenWorker, exportWorker };
}

if (process.env.NODE_ENV !== 'test' && process.argv[1]?.includes('worker')) {
  startWorker();
}
