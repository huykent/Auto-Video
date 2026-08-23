import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface FilamentInfo {
  types: string[];
  colors: string[];
}

export interface ScrapedModelData {
  makerworldId: string;
  title: string;
  url: string;
  author: string;
  filamentTypes: string[];
  filamentColors: string[];
  printTimeMinutes: number;
  weightGrams: number;
  rawImages: string[];
}

export function parseFilamentInfo(text: string): FilamentInfo {
  const typesSet = new Set<string>();
  const colorsSet = new Set<string>();

  const knownTypes = ['PLA', 'PETG', 'TPU', 'ABS', 'ASA', 'PNC', 'PC', 'Nylon', 'Resin'];
  const knownColors = [
    'White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Gold', 
    'Silver', 'Grey', 'Gray', 'Purple', 'Orange', 'Pink', 'Clear'
  ];

  for (const t of knownTypes) {
    if (new RegExp(`\\b${t}\\b`, 'i').test(text)) {
      typesSet.add(t);
    }
  }

  for (const c of knownColors) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(text)) {
      colorsSet.add(c);
    }
  }

  const types = typesSet.size > 0 ? Array.from(typesSet) : ['PLA'];
  const colors = colorsSet.size > 0 ? Array.from(colorsSet) : ['Standard'];

  return { types, colors };
}

export function sanitizeModelTitle(title: string): string {
  return title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export function formatPrintTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export async function scrapeMakerWorldKeyword(keyword: string, limit: number = 5): Promise<ScrapedModelData[]> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  const searchUrl = `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(keyword)}`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const results: ScrapedModelData[] = [];

  try {
    // Wait for model cards
    await page.waitForSelector('.model-card, a[href*="/models/"]', { timeout: 10000 });

    const modelLinks = await page.$$eval('a[href*="/models/"]', (links) => {
      const uniqueUrls = new Set<string>();
      links.forEach((l) => {
        const href = (l as HTMLAnchorElement).href;
        if (href.match(/\/models\/\d+/)) {
          uniqueUrls.add(href);
        }
      });
      return Array.from(uniqueUrls);
    });

    const targetUrls = modelLinks.slice(0, limit);

    for (const url of targetUrls) {
      const match = url.match(/\/models\/(\d+)/);
      if (!match) continue;
      const modelId = match[1];

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      const title = (await page.title()).replace('- MakerWorld', '').trim();
      const author = await page.$eval('.author-name, .user-name', (el) => el.textContent?.trim() || 'Unknown').catch(() => 'Unknown');

      const pageText = await page.content();
      const filamentInfo = parseFilamentInfo(pageText);

      // Scrape images
      const imageUrls = await page.$$eval('img[src*="makerworld"]', (imgs) => {
        return imgs.map((img) => (img as HTMLImageElement).src).filter((src) => src.includes('design') || src.includes('cover'));
      }).catch(() => []);

      const storageDir = path.resolve(process.cwd(), `storage/raw_images/${modelId}`);
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }

      const localImages: string[] = [];
      for (let i = 0; i < imageUrls.length && i < 5; i++) {
        const imgPath = path.join(storageDir, `image_${i + 1}.jpg`);
        localImages.push(imgPath);
      }

      const modelData: ScrapedModelData = {
        makerworldId: modelId,
        title: title || `MakerWorld Model ${modelId}`,
        url,
        author,
        filamentTypes: filamentInfo.types,
        filamentColors: filamentInfo.colors,
        printTimeMinutes: 120,
        weightGrams: 50,
        rawImages: localImages,
      };

      results.push(modelData);

      // Save to SQLite database
      const now = new Date().toISOString();
      const existing = await db.select().from(products).where(eq(products.makerworldId, modelId));
      if (existing.length === 0) {
        await db.insert(products).values({
          id: `prod-${modelId}`,
          makerworldId: modelId,
          title: modelData.title,
          url: modelData.url,
          author: modelData.author,
          filamentTypes: JSON.stringify(modelData.filamentTypes),
          filamentColors: JSON.stringify(modelData.filamentColors),
          printTimeMinutes: modelData.printTimeMinutes,
          weightGrams: modelData.weightGrams,
          status: 'CRAWLED',
          rawImages: JSON.stringify(modelData.rawImages),
          selectedCoverImage: localImages[0] || null,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  } catch (err) {
    console.error('[MakerWorld Scraper Error]:', err);
  } finally {
    await browser.close();
  }

  return results;
}
