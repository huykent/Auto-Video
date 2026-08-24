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
          // Mark status as WAITING_EXT so Chrome Extension can pick it up
          await db.update(searchJobs).set({ status: 'WAITING_EXT' }).where(eq(searchJobs.id, jobId));
        }

        // Wait up to 30 seconds for Chrome Extension to pick up and complete the job
        let extensionHandled = false;
        for (let i = 0; i < 30; i++) {
          await new Promise((r) => setTimeout(r, 1000));
          if (jobId) {
            const currentJob = await db.select().from(searchJobs).where(eq(searchJobs.id, jobId));
            if (currentJob.length > 0) {
              const st = currentJob[0].status;
              if (st === 'COMPLETED') {
                console.log(`[Crawler Worker] Job ${jobId} was successfully completed by Chrome Extension Bridge!`);
                extensionHandled = true;
                break;
              }
              if (st === 'EXT_RUNNING' || st === 'WAITING_EXT' || st === 'PENDING') {
                // Extension is currently working on it, keep waiting!
                continue;
              }
            }
          }
        }

        if (extensionHandled) {
          return { status: 'completed_by_extension', jobId };
        }

        // Check if extension completed it right at the 30-second mark
        if (jobId) {
          const finalCheck = await db.select().from(searchJobs).where(eq(searchJobs.id, jobId));
          if (finalCheck.length > 0 && finalCheck[0].status === 'COMPLETED') {
            return { status: 'completed_by_extension', jobId };
          }
        }

        console.log(`[Crawler Worker] Job ${jobId} fallback to Playwright/Bambu API Engine...`);
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
