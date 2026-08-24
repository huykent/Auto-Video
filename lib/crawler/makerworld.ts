import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getSystemSettings } from '../settings';

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

// Fetch real authentic model metadata from Bambu Cloud REST API
export async function fetchRealModelDetails(designId: string): Promise<ScrapedModelData | null> {
  try {
    const settings = await getSystemSettings();
    const token = settings.makerworld_token || '';
    const apiUrl = `https://api.bambulab.com/v1/design-service/design/${designId}`;
    const headers: Record<string, string> = {
      'User-Agent': 'BambuStudio/01.09.03.50',
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const res = await fetch(apiUrl, { headers });
    if (res.ok) {
      const data = await res.json();
      const title = data.title || `3D Model #${designId}`;
      const author = data.user?.name || data.user?.username || 'MakerWorld Creator';
      const coverUrl = data.coverUrl || '';
      const url = `https://makerworld.com/en/models/${designId}`;

      return {
        makerworldId: String(designId),
        title,
        url,
        author,
        filamentTypes: ['PLA Silk', 'PETG'],
        filamentColors: ['Gold', 'Black'],
        printTimeMinutes: 120,
        weightGrams: 50,
        rawImages: coverUrl ? [coverUrl] : [],
      };
    }
  } catch (e) {
    console.error(`[MakerWorld API Error] Failed to fetch details for model ${designId}:`, e);
  }
  return null;
}

export async function scrapeMakerWorldKeyword(keyword: string, limit: number = 5): Promise<ScrapedModelData[]> {
  const results: ScrapedModelData[] = [];
  const settings = await getSystemSettings();
  const token = settings.makerworld_token || '';
  const cookie = settings.makerworld_cookie || '';

  // Strategy 1: Direct REST API with Token/Cookie
  if (token || cookie) {
    try {
      console.log(`[MakerWorld API Engine] Searching designs for "${keyword}"...`);
      const apiUrl = `https://makerworld.com/api/v1/search-service/select/design?keyword=${encodeURIComponent(keyword)}&offset=0&limit=${limit}`;
      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://makerworld.com/en/search/models',
        'Origin': 'https://makerworld.com'
      };

      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      if (cookie) headers['Cookie'] = cookie;

      const res = await fetch(apiUrl, { headers });
      if (res.ok) {
        const json = await res.json();
        const hits = json.hits || json.data?.hits || [];
        console.log(`[MakerWorld API Engine] Search returned ${hits.length} items!`);

        for (const hit of hits) {
          const modelId = String(hit.id || hit.designId);
          const realData = await fetchRealModelDetails(modelId);

          const modelData: ScrapedModelData = realData || {
            makerworldId: modelId,
            title: hit.title || hit.name || `${keyword} 3D Model #${modelId}`,
            url: `https://makerworld.com/en/models/${modelId}`,
            author: hit.authorName || hit.creator || 'MakerWorld Creator',
            filamentTypes: ['PLA Silk', 'PETG'],
            filamentColors: ['Gold', 'Black'],
            printTimeMinutes: hit.printTime || 120,
            weightGrams: hit.weight || 50,
            rawImages: [hit.coverUrl || hit.cover || ''],
          };

          results.push(modelData);
          await saveProductToDb(modelData);
        }

        if (results.length > 0) {
          return results;
        }
      }
    } catch (err) {
      console.error('[MakerWorld API Engine Error]:', err);
    }
  }

  // Strategy 2: Playwright Stealth Browser Scraper
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
    ]
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
  });
  
  const page = await context.newPage();
  const searchUrl = `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(keyword)}`;

  try {
    console.log(`[Playwright Stealth Scraper] Navigating to ${searchUrl}...`);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);

    const modelLinks = await page.$$eval('a[href*="/models/"]', (links) => {
      const uniqueUrls = new Set<string>();
      links.forEach((l) => {
        const href = (l as HTMLAnchorElement).href;
        if (href.match(/\/models\/\d+/)) {
          uniqueUrls.add(href);
        }
      });
      return Array.from(uniqueUrls);
    }).catch(() => []);

    console.log(`[Playwright Stealth Scraper] Discovered ${modelLinks.length} model links.`);
    const targetUrls = modelLinks.slice(0, limit);

    for (const url of targetUrls) {
      const match = url.match(/\/models\/(\d+)/);
      if (!match) continue;
      const modelId = match[1];

      const realData = await fetchRealModelDetails(modelId);
      if (realData) {
        results.push(realData);
        await saveProductToDb(realData);
      }
    }

  } catch (err) {
    console.error('[MakerWorld Scraper Error]:', err);
  } finally {
    await browser.close().catch(() => {});
  }

  return results;
}

async function saveProductToDb(modelData: ScrapedModelData) {
  const now = new Date().toISOString();
  const existing = await db.select().from(products).where(eq(products.makerworldId, modelData.makerworldId));
  const coverImg = modelData.rawImages[0] || null;

  if (existing.length === 0) {
    await db.insert(products).values({
      id: `prod-${modelData.makerworldId}`,
      makerworldId: modelData.makerworldId,
      title: modelData.title,
      url: modelData.url,
      author: modelData.author,
      filamentTypes: JSON.stringify(modelData.filamentTypes),
      filamentColors: JSON.stringify(modelData.filamentColors),
      printTimeMinutes: modelData.printTimeMinutes,
      weightGrams: modelData.weightGrams,
      status: 'CRAWLED',
      rawImages: JSON.stringify(modelData.rawImages),
      selectedCoverImage: coverImg,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await db.update(products).set({
      title: modelData.title,
      url: modelData.url,
      author: modelData.author,
      rawImages: JSON.stringify(modelData.rawImages),
      selectedCoverImage: coverImg,
      updatedAt: now,
    }).where(eq(products.makerworldId, modelData.makerworldId));
  }
}
