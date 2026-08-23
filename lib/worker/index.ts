import { Worker } from 'bullmq';
import { connection } from '../queue';

export function startWorker() {
  const crawlerWorker = new Worker(
    'crawler-queue',
    async (job) => {
      console.log(`[Crawler Worker] Processing job ${job.id}:`, job.data);
      // Worker processing logic will be delegated to scraper service in Task 3
      return { status: 'completed', jobId: job.id };
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
