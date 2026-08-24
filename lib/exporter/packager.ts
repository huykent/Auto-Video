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
    throw new Error(`Mẫu 3D ${productId} không tồn tại trong cơ sở dữ liệu`);
  }

  const product = result[0];
  let types: string[] = [];
  let colors: string[] = [];
  let images: string[] = [];

  try {
    const parsedTypes = JSON.parse(product.filamentTypes || '[]');
    if (Array.isArray(parsedTypes)) types = parsedTypes;
  } catch (e) {}

  try {
    const parsedColors = JSON.parse(product.filamentColors || '[]');
    if (Array.isArray(parsedColors)) colors = parsedColors;
  } catch (e) {}

  try {
    const parsedImages = JSON.parse(product.rawImages || '[]');
    if (Array.isArray(parsedImages)) images = parsedImages;
  } catch (e) {}

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

  // Copy generated video safely
  const localVideoPath = path.resolve(process.cwd(), 'storage/generated_videos', `${product.id}.mp4`);
  if (fs.existsSync(localVideoPath)) {
    const destVideo = path.join(exportDir, 'video_product.mp4');
    fs.copyFileSync(localVideoPath, destVideo);
    createdFiles.push(destVideo);
  } else if (product.generatedVideoPath) {
    try {
      if (fs.existsSync(product.generatedVideoPath)) {
        const destVideo = path.join(exportDir, 'video_product.mp4');
        fs.copyFileSync(product.generatedVideoPath, destVideo);
        createdFiles.push(destVideo);
      }
    } catch (e) {}
  }

  // Copy images safely
  images.forEach((imgFile: string, index: number) => {
    try {
      if (typeof imgFile === 'string' && fs.existsSync(imgFile)) {
        const destImg = path.join(exportDir, `image_${index + 1}.jpg`);
        fs.copyFileSync(imgFile, destImg);
        createdFiles.push(destImg);
      }
    } catch (e) {}
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
