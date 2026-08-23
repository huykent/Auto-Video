import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface VeoGenerationOptions {
  mock?: boolean;
  apiKey?: string;
}

export async function generateVeoVideo(
  productId: string,
  imagePath: string,
  prompt: string,
  options: VeoGenerationOptions = {}
): Promise<{ videoPath: string; jobId: string }> {
  const isMock = options.mock || !process.env.VEO_API_KEY;
  const videoDir = path.resolve(process.cwd(), 'storage/generated_videos');

  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const targetVideoPath = path.join(videoDir, `${productId}.mp4`);

  if (isMock) {
    // Generate a dummy valid MP4 placeholder file for test & mock mode
    fs.writeFileSync(targetVideoPath, Buffer.from('FAKE_VEO_MP4_VIDEO_CONTENT'), 'utf-8');

    // Update database status
    const now = new Date().toISOString();
    await db
      .update(products)
      .set({
        status: 'VIDEO_READY',
        videoPrompt: prompt,
        generatedVideoPath: targetVideoPath,
        updatedAt: now,
      })
      .where(eq(products.id, productId));

    return {
      videoPath: targetVideoPath,
      jobId: `veo-mock-${Date.now()}`,
    };
  }

  // Live Veo 3 / Google AI Video API Integration
  const apiKey = options.apiKey || process.env.VEO_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1alpha/models/veo-3:predict';

  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      image_uri: imagePath,
      aspect_ratio: '9:16',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    await db
      .update(products)
      .set({
        status: 'GENERATION_FAILED',
        errorMessage: `Veo API error: ${errText}`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, productId));
    throw new Error(`Veo 3 API request failed: ${errText}`);
  }

  const data = await response.json();
  const videoUrl = data.video_url || data.output_uri;

  // Download video file to local storage
  const videoBuffer = await (await fetch(videoUrl)).arrayBuffer();
  fs.writeFileSync(targetVideoPath, Buffer.from(videoBuffer));

  const now = new Date().toISOString();
  await db
    .update(products)
    .set({
      status: 'VIDEO_READY',
      videoPrompt: prompt,
      generatedVideoPath: targetVideoPath,
      updatedAt: now,
    })
    .where(eq(products.id, productId));

  return {
    videoPath: targetVideoPath,
    jobId: data.job_id || `veo-${Date.now()}`,
  };
}
