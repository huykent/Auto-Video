import { Queue } from 'bullmq';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const connection = {
  host: redisHost,
  port: redisPort,
};

export const crawlerQueue = new Queue('crawler-queue', { connection });
export const videoGenQueue = new Queue('video-gen-queue', { connection });
export const exportQueue = new Queue('export-queue', { connection });
