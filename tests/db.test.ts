import { describe, it, expect } from 'vitest';
import { db } from '../lib/db';
import { products } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

describe('Database Schema', () => {
  it('should insert and retrieve a product record from SQLite', async () => {
    const testId = `test-${Date.now()}`;
    const now = new Date().toISOString();

    await db.insert(products).values({
      id: testId,
      makerworldId: `mw-${Date.now()}`,
      title: 'Test 3D Dragon Model',
      url: 'https://makerworld.com/en/models/12345',
      author: 'TestMaker',
      filamentTypes: JSON.stringify(['PLA', 'PETG']),
      filamentColors: JSON.stringify(['Black', 'Gold']),
      status: 'CRAWLED',
      rawImages: JSON.stringify(['/storage/raw_images/test.jpg']),
      createdAt: now,
      updatedAt: now,
    });

    const result = await db.select().from(products).where(eq(products.id, testId));
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Test 3D Dragon Model');
    expect(result[0].status).toBe('CRAWLED');
    expect(JSON.parse(result[0].filamentTypes)).toEqual(['PLA', 'PETG']);
  });
});
