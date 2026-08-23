import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateShopeeTitle, generateShopeeDescription } from './shopee';
import { generateTikTokMetadata } from './tiktok';

export async function exportProductPackage(productId: string): Promise<{ exportDir: string; files: string[] }> {
  const result = await db.select().from(products).where(eq(products.id, productId));
  if (result.length === 0) {
    throw new Error(`Product ${productId} not found in database`);
  }

  const product = result[0];
  const types = JSON.parse(product.filamentTypes || '[]');
  const colors = JSON.parse(product.filamentColors || '[]');
  const images = JSON.parse(product.rawImages || '[]');

  const shopeeTitle = generateShopeeTitle(product.title, types, colors);
  const shopeeDesc = generateShopeeDescription(
    product.title,
    product.author || 'Maker',
    types,
    colors,
    product.printTimeMinutes || 60,
    product.weightGrams || 50
  );
  const tiktokMeta = generateTikTokMetadata(product.title, types, colors);

  const exportDir = path.resolve(process.cwd(), `storage/export_packages/${product.id}`);
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const createdFiles: string[] = [];

  // Write content.txt
  const contentPath = path.join(exportDir, 'content.txt');
  fs.writeFileSync(contentPath, `TIÊU ĐỀ SHOPEE:\n${shopeeTitle}\n\nMÔ TẢ SHOPEE:\n${shopeeDesc}`, 'utf-8');
  createdFiles.push(contentPath);

  // Write tiktok_metadata.json
  const tiktokPath = path.join(exportDir, 'tiktok_metadata.json');
  fs.writeFileSync(tiktokPath, JSON.stringify(tiktokMeta, null, 2), 'utf-8');
  createdFiles.push(tiktokPath);

  // Copy generated video
  if (product.generatedVideoPath && fs.existsSync(product.generatedVideoPath)) {
    const destVideo = path.join(exportDir, 'video_product.mp4');
    fs.copyFileSync(product.generatedVideoPath, destVideo);
    createdFiles.push(destVideo);
  }

  // Copy images
  images.forEach((imgFile: string, index: number) => {
    if (fs.existsSync(imgFile)) {
      const destImg = path.join(exportDir, `image_${index + 1}.jpg`);
      fs.copyFileSync(imgFile, destImg);
      createdFiles.push(destImg);
    }
  });

  // Update status to EXPORTED
  const now = new Date().toISOString();
  await db
    .update(products)
    .set({
      status: 'EXPORTED',
      exportTitle: shopeeTitle,
      exportDescription: shopeeDesc,
      updatedAt: now,
    })
    .where(eq(products.id, productId));

  return {
    exportDir,
    files: createdFiles,
  };
}
