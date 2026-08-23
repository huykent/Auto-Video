import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'data/app.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const client = createClient({
  url: `file:${dbPath.replace(/\\/g, '/')}`,
});

// Initialize SQLite tables
await client.execute(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    makerworld_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    author TEXT,
    filament_types TEXT NOT NULL,
    filament_colors TEXT NOT NULL,
    print_time_minutes INTEGER,
    weight_grams REAL,
    status TEXT NOT NULL DEFAULT 'DISCOVERED',
    raw_images TEXT NOT NULL,
    selected_cover_image TEXT,
    video_prompt TEXT,
    generated_video_path TEXT,
    export_title TEXT,
    export_description TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

await client.execute(`
  CREATE TABLE IF NOT EXISTS search_jobs (
    id TEXT PRIMARY KEY,
    keyword TEXT NOT NULL,
    max_results INTEGER NOT NULL DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'PENDING',
    items_found INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

await client.execute(`
  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

export const db = drizzle(client, { schema });
