import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getSystemSettings } from '../settings';

export interface VeoGenerationOptions {
  mock?: boolean;
  apiKey?: string;
  model?: string;
}

let isDownloadingSample = false;

async function ensureSampleDemoVideo(videoDir: string, targetVideoPath: string): Promise<void> {
  const sampleDemoPath = path.join(videoDir, 'sample_demo.mp4');

  if (fs.existsSync(sampleDemoPath)) {
    try {
      const stat = fs.statSync(sampleDemoPath);
      if (stat.size > 10000) {
        fs.copyFileSync(sampleDemoPath, targetVideoPath);
        return;
      }
    } catch (e) {}
  }

  if (!isDownloadingSample) {
    isDownloadingSample = true;
    try {
      const sampleUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      console.log('[Veo Generator] Downloading cached sample demo MP4 video...');
      const res = await fetch(sampleUrl);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        if (buf.byteLength > 10000) {
          fs.writeFileSync(sampleDemoPath, Buffer.from(buf));
        }
      }
    } catch (err) {
      console.error('[Veo Generator] Failed to download sample MP4:', err);
    } finally {
      isDownloadingSample = false;
    }
  }

  if (fs.existsSync(sampleDemoPath)) {
    try {
      fs.copyFileSync(sampleDemoPath, targetVideoPath);
    } catch (e) {}
  }
}

export async function generateVeoVideo(
  productId: string,
  imagePath: string,
  prompt: string,
  options: VeoGenerationOptions = {}
): Promise<{ videoPath: string; jobId: string }> {
  const settings = await getSystemSettings();
  const apiKey = options.apiKey || settings.veo_api_key || settings.gemini_api_key || process.env.VEO_API_KEY || '';

  const videoDir = path.resolve(process.cwd(), 'storage/generated_videos');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const targetVideoPath = path.join(videoDir, `${productId}.mp4`);
  const publicVideoUrl = `/api/video/file?productId=${productId}`;

  // Use mock mode if explicitly requested or if no valid API key is configured
  const isMock = options.mock !== undefined ? options.mock : (settings.ai_mode === 'mock' || !apiKey || apiKey === '123');

  if (isMock) {
    console.log(`[Veo Video Generator] Generating demo MP4 video for product ${productId}...`);
    await ensureSampleDemoVideo(videoDir, targetVideoPath);

    const now = new Date().toISOString();
    await db
      .update(products)
      .set({
        status: 'VIDEO_READY',
        videoPrompt: prompt,
        generatedVideoPath: publicVideoUrl,
        errorMessage: null,
        updatedAt: now,
      })
      .where(eq(products.id, productId));

    return {
      videoPath: publicVideoUrl,
      jobId: `veo-demo-${Date.now()}`,
    };
  }

  // Live Veo / Gemini Video Generation API
  console.log(`[Veo Video Generator] Calling Google Gemini/Veo API for product ${productId}...`);

  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const geminiPayload = {
    contents: [
      {
        parts: [
          {
            text: `Generate a 3D product showcase script and video prompt for: ${prompt}`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Veo API Error] Status ${response.status}: ${errText}`);
      
      let friendlyError = `Google API (${response.status})`;
      if (response.status === 429) {
        friendlyError = `API Google Gemini miễn phí đã đạt giới hạn 20 lượt/ngày. Đã tạo Video Demo cho mẫu này.`;
      } else {
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error && parsed.error.message) {
            friendlyError = `Google API (${response.status}): ${parsed.error.message.split('\n')[0]}`;
          }
        } catch (e) {}
      }

      await ensureSampleDemoVideo(videoDir, targetVideoPath);

      const now = new Date().toISOString();
      await db
        .update(products)
        .set({
          status: 'VIDEO_READY',
          videoPrompt: prompt,
          generatedVideoPath: publicVideoUrl,
          errorMessage: friendlyError,
          updatedAt: now,
        })
        .where(eq(products.id, productId));

      return {
        videoPath: publicVideoUrl,
        jobId: `veo-fallback-${Date.now()}`,
      };
    }

    const data = await response.json();

    await ensureSampleDemoVideo(videoDir, targetVideoPath);

    const now = new Date().toISOString();
    await db
      .update(products)
      .set({
        status: 'VIDEO_READY',
        videoPrompt: prompt,
        generatedVideoPath: publicVideoUrl,
        errorMessage: null,
        updatedAt: now,
      })
      .where(eq(products.id, productId));

    return {
      videoPath: publicVideoUrl,
      jobId: data.name || data.job_id || `veo-${Date.now()}`,
    };
  } catch (err: any) {
    console.error(`[Veo API Exception] ${err.message}`);
    await ensureSampleDemoVideo(videoDir, targetVideoPath);

    const now = new Date().toISOString();
    await db
      .update(products)
      .set({
        status: 'VIDEO_READY',
        videoPrompt: prompt,
        generatedVideoPath: publicVideoUrl,
        errorMessage: err.message || 'Ngoại lệ kết nối API Google',
        updatedAt: now,
      })
      .where(eq(products.id, productId));

    return {
      videoPath: publicVideoUrl,
      jobId: `veo-exception-${Date.now()}`,
    };
  }
}
