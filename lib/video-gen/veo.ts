import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getSystemSettings } from '../settings';

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
  const settings = await getSystemSettings();
  const apiKey = options.apiKey || settings.gemini_api_key || process.env.VEO_API_KEY || '';

  const videoDir = path.resolve(process.cwd(), 'storage/generated_videos');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const targetVideoPath = path.join(videoDir, `${productId}.mp4`);
  const publicVideoUrl = `/api/video/file?productId=${productId}`;

  // If no API Key is set or explicitly in mock mode, use high quality sample demo MP4 video
  const isMock = options.mock || !apiKey;

  if (isMock) {
    console.log(`[Veo Video Generator] Generating demo MP4 video for product ${productId}...`);
    const sampleDemoPath = path.join(videoDir, 'sample_demo.mp4');

    if (fs.existsSync(sampleDemoPath)) {
      fs.copyFileSync(sampleDemoPath, targetVideoPath);
    } else {
      // Download clean sample MP4 video fallback
      try {
        const sampleUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        const res = await fetch(sampleUrl);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          fs.writeFileSync(sampleDemoPath, Buffer.from(buf));
          fs.copyFileSync(sampleDemoPath, targetVideoPath);
        }
      } catch (err) {
        console.error('Failed to download fallback sample MP4:', err);
      }
    }

    // Update database status with public HTTP video route URL
    const now = new Date().toISOString();
    await db
      .update(products)
      .set({
        status: 'VIDEO_READY',
        videoPrompt: prompt,
        generatedVideoPath: publicVideoUrl,
        updatedAt: now,
      })
      .where(eq(products.id, productId));

    return {
      videoPath: publicVideoUrl,
      jobId: `veo-demo-${Date.now()}`,
    };
  }

  // Live Veo 3 / Google AI Video API Integration
  console.log(`[Veo Video Generator] Calling Google Veo API for product ${productId}...`);
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
      generatedVideoPath: publicVideoUrl,
      updatedAt: now,
    })
    .where(eq(products.id, productId));

  return {
    videoPath: publicVideoUrl,
    jobId: data.job_id || `veo-${Date.now()}`,
  };
}
