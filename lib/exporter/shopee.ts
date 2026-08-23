export function generateShopeeTitle(title: string, types: string[], colors: string[]): string {
  const typeStr = types[0] || 'PLA';
  const colorStr = colors[0] || 'Nhiều Màu';
  const formatted = `Mô hình in 3D ${title} - Nhựa ${typeStr} Cao Cấp (${colorStr}) - Trang Trí / Quà Tặng`;
  return formatted.substring(0, 120);
}

export function generateShopeeDescription(
  title: string,
  author: string,
  types: string[],
  colors: string[],
  printTimeMinutes: number = 60,
  weightGrams: number = 50
): string {
  const typeStr = types.join(', ') || 'PLA';
  const colorStr = colors.join(', ') || 'Standard';
  const hours = Math.floor(printTimeMinutes / 60);

  return `🔥 MÔ TẢ SẢN PHẨM: Mô Hình In 3D ${title} 🔥

📌 THÔNG SỐ KĨ THUẬT:
- Tên mẫu: ${title} (Thiết kế bởi ${author})
- Chất liệu: Nhựa in 3D ${typeStr} cao cấp, bền đẹp, thân thiện môi trường
- Màu sắc: ${colorStr}
- Trọng lượng ước tính: ${weightGrams}g
- Thời gian in: ${hours}h

✨ ĐẶC ĐIỂM NỔI BẬT:
- Độ chi tiết sắc nét, bề mặt nhựa láng mịn.
- Thích hợp làm quà tặng sinh nhật, trang trí bàn làm việc, góc học tập.
- Đóng gói cẩn thận chống va đập khi vận chuyển.

#in3d #3dprint #mohinhin3d #${title.toLowerCase().replace(/\s+/g, '')} #decor`;
}
