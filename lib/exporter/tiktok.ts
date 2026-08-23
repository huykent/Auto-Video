export interface TikTokMetadata {
  product_name: string;
  category_id: number;
  description: string;
  material: string;
  tags: string[];
}

export function generateTikTokMetadata(title: string, types: string[], colors: string[]): TikTokMetadata {
  const typeStr = types[0] || 'PLA';
  const colorStr = colors[0] || 'Gold';

  return {
    product_name: `[In 3D] ${title} - Nhựa ${typeStr} (${colorStr})`,
    category_id: 100234,
    description: `Mô hình in 3D ${title} sắc nét, màu sắc ${colorStr}, nhựa ${typeStr} cao cấp.`,
    material: typeStr,
    tags: ['3dprint', 'mohinhin3d', 'decor', 'bancanhan'],
  };
}
