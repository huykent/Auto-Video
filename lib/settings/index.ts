import { db } from '../db';
import { systemSettings } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface SystemSettingsPayload {
  veo_api_key?: string;
  gemini_api_key?: string;
  ai_mode?: 'mock' | 'live';
  max_crawl_items?: string;
  makerworld_token?: string;
  makerworld_cookie?: string;
}

export async function getSystemSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(systemSettings);
  const result: Record<string, string> = {
    veo_api_key: '',
    gemini_api_key: '',
    ai_mode: 'mock',
    max_crawl_items: '10',
    makerworld_token: '',
    makerworld_cookie: '',
  };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

export async function updateSystemSettings(payload: SystemSettingsPayload): Promise<void> {
  const now = new Date().toISOString();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) {
      const existing = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
      if (existing.length > 0) {
        await db.update(systemSettings).set({ value: String(value), updatedAt: now }).where(eq(systemSettings.key, key));
      } else {
        await db.insert(systemSettings).values({ key, value: String(value), updatedAt: now });
      }
    }
  }
}
