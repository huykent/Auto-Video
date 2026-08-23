# Keyword Crawler & API Settings Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the System Settings page (`/settings`) to manage API keys (Veo 3, Gemini) and AI execution mode (Mock/Live), and upgrade the Discovery page (`/discovery`) with keyword management, batch crawling, and real-time job history polling.

**Architecture:** Extend SQLite schema with `system_settings` table, build REST APIs (`/api/settings`, `/api/crawler`), and connect the UI to BullMQ crawler queues and Playwright background workers.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Drizzle ORM, SQLite, BullMQ, Redis, Vitest.

## Global Constraints

- Node.js 18+ environment.
- SQLite file located at `./data/app.db`.
- All API routes must export `export const dynamic = 'force-dynamic'`.
- All tasks must pass Vitest tests (`npx vitest run`).

---

### Task 1: Database Schema Extension & Settings Helper Module

**Files:**
- Modify: `lib/db/schema.ts`
- Modify: `lib/db/index.ts`
- Create: `lib/settings/index.ts`
- Create: `tests/settings.test.ts`

**Interfaces:**
- Produces: `systemSettings` table schema, `getSystemSettings()`, `updateSystemSettings()` functions.

- [ ] **Step 1: Write the failing settings test**

```typescript
// tests/settings.test.ts
import { describe, it, expect } from 'vitest';
import { getSystemSettings, updateSystemSettings } from '../lib/settings';

describe('System Settings Module', () => {
  it('should save and retrieve system settings', async () => {
    await updateSystemSettings({
      veo_api_key: 'test_veo_key_123',
      gemini_api_key: 'test_gemini_key_456',
      ai_mode: 'mock',
      max_crawl_items: '15',
    });

    const settings = await getSystemSettings();
    expect(settings.veo_api_key).toBe('test_veo_key_123');
    expect(settings.gemini_api_key).toBe('test_gemini_key_456');
    expect(settings.ai_mode).toBe('mock');
    expect(settings.max_crawl_items).toBe('15');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/settings.test.ts`
Expected: FAIL (Cannot find module `../lib/settings`)

- [ ] **Step 3: Update `lib/db/schema.ts` and `lib/db/index.ts`**

Add `systemSettings` table in `lib/db/schema.ts`:
```typescript
export const systemSettings = sqliteTable('system_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

Add table initialization SQL in `lib/db/index.ts`:
```sql
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

- [ ] **Step 4: Implement `lib/settings/index.ts`**

```typescript
import { db } from '../db';
import { systemSettings } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface SystemSettingsPayload {
  veo_api_key?: string;
  gemini_api_key?: string;
  ai_mode?: 'mock' | 'live';
  max_crawl_items?: string;
}

export async function getSystemSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(systemSettings);
  const result: Record<string, string> = {
    veo_api_key: '',
    gemini_api_key: '',
    ai_mode: 'mock',
    max_crawl_items: '10',
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/settings.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/db/schema.ts lib/db/index.ts lib/settings/index.ts tests/settings.test.ts
git commit -m "feat(settings): add systemSettings database schema and settings helper module"
```

---

### Task 2: System Settings REST API & UI Page

**Files:**
- Create: `app/api/settings/route.ts`
- Create: `app/settings/page.tsx`
- Modify: `app/landing/page.tsx` (add navigation link to `/settings`)

**Interfaces:**
- Produces: `GET /api/settings`, `POST /api/settings`, `/settings` Next.js page.

- [ ] **Step 1: Implement `app/api/settings/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { getSystemSettings, updateSystemSettings } from '../../../lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSystemSettings();
    return NextResponse.json(settings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await updateSystemSettings(body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Build `app/settings/page.tsx`**

Build full Dark Mode UI with form controls for `veo_api_key`, `gemini_api_key`, `ai_mode` toggle switch, and `max_crawl_items` count. Save settings via `POST /api/settings`.

- [ ] **Step 3: Run Vitest to verify no regressions**

Run: `npx vitest run`
Expected: 13 passed

- [ ] **Step 4: Commit**

```bash
git add app/api/settings/route.ts app/settings/page.tsx app/landing/page.tsx
git commit -m "feat(ui): add system settings API route and /settings configuration page"
```

---

### Task 3: Keyword Crawler Control Panel & Search Jobs Engine

**Files:**
- Modify: `app/api/crawler/route.ts`
- Modify: `app/discovery/page.tsx`

**Interfaces:**
- Produces: `GET /api/crawler` (job list), `POST /api/crawler` (batch job creator), `/discovery` management panel.

- [ ] **Step 1: Update `app/api/crawler/route.ts`**

Add `GET` method to return recent `search_jobs` from SQLite DB, and update `POST` method to handle comma-separated keywords and queue jobs to BullMQ `crawler-queue`.

```typescript
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { searchJobs } from '../../../lib/db/schema';
import { crawlerQueue } from '../../../lib/queue';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const jobs = await db.select().from(searchJobs).orderBy(desc(searchJobs.createdAt)).limit(20);
    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawKeywords = body.keyword as string;
    const maxResults = Number(body.maxResults || 10);

    if (!rawKeywords) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    const keywordList = rawKeywords.split(',').map((k) => k.trim()).filter(Boolean);
    const createdJobs = [];

    for (const kw of keywordList) {
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      await db.insert(searchJobs).values({
        id: jobId,
        keyword: kw,
        maxResults,
        status: 'PENDING',
        itemsFound: 0,
        createdAt: now,
      });

      await crawlerQueue.add('crawl-keyword', { jobId, keyword: kw, maxResults });
      createdJobs.push(jobId);
    }

    return NextResponse.json({ success: true, jobIds: createdJobs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Upgrade `app/discovery/page.tsx` UI**

Add:
- Form to submit new keywords (comma-separated support) with items count.
- Real-time polling table fetching `GET /api/crawler` every 3 seconds to track job progress.

- [ ] **Step 3: Run Vitest to verify all test suites pass**

Run: `npx vitest run`
Expected: PASS (All tests pass)

- [ ] **Step 4: Commit and Push**

```bash
git add app/api/crawler/route.ts app/discovery/page.tsx
git commit -m "feat(crawler): add batch keyword control panel and real-time job history polling"
git push origin main
```
