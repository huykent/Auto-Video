import { describe, it, expect } from 'vitest';
import { crawlerQueue, videoGenQueue, exportQueue } from '../lib/queue';

describe('BullMQ Queue Initialization', () => {
  it('should initialize crawler, video gen, and export queues with valid names', () => {
    expect(crawlerQueue.name).toBe('crawler-queue');
    expect(videoGenQueue.name).toBe('video-gen-queue');
    expect(exportQueue.name).toBe('export-queue');
  });
});
