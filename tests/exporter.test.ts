import { describe, it, expect } from 'vitest';
import { generateShopeeTitle, generateShopeeDescription } from '../lib/exporter/shopee';
import { generateTikTokMetadata } from '../lib/exporter/tiktok';

describe('E-Commerce SEO & Package Exporter Engine', () => {
  it('should generate formatted Shopee SEO title within 120 chars', () => {
    const title = generateShopeeTitle('Dragon Figurine', ['PLA'], ['Silk Gold']);
    expect(title).toContain('Mô hình in 3D');
    expect(title).toContain('Dragon Figurine');
    expect(title).toContain('PLA');
    expect(title.length).toBeLessThanOrEqual(120);
  });

  it('should generate detailed Shopee description text with features and material specs', () => {
    const desc = generateShopeeDescription('Dragon Figurine', 'Awesome Maker', ['PLA'], ['Gold'], 120, 50);
    expect(desc).toContain('MÔ TẢ SẢN PHẨM');
    expect(desc).toContain('Chất liệu: Nhựa in 3D PLA');
    expect(desc).toContain('Màu sắc: Gold');
    expect(desc).toContain('Thời gian in: 2h');
    expect(desc).toContain('#in3d');
  });

  it('should generate TikTok Shop formatted metadata JSON', () => {
    const tiktok = generateTikTokMetadata('Dragon Figurine', ['PLA'], ['Gold']);
    expect(tiktok.product_name).toContain('Dragon Figurine');
    expect(tiktok.category_id).toBe(100234);
    expect(tiktok.tags).toContain('3dprint');
  });
});
