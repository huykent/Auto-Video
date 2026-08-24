import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || searchParams.get('id') || '';

    if (!productId) {
      return new NextResponse('Product ID required', { status: 400 });
    }

    const pkgDir = path.resolve(process.cwd(), 'storage/export_packages', productId);
    if (!fs.existsSync(pkgDir)) {
      return new NextResponse('Export package not found', { status: 404 });
    }

    const zipPath = path.resolve(process.cwd(), 'storage/export_packages', `${productId}_package.zip`);
    
    // Create ZIP using system zip tool or python fallback
    try {
      await execAsync(`cd "${pkgDir}" && zip -r "${zipPath}" ./*`);
    } catch (e) {
      const pyZip = `import shutil; shutil.make_archive("${zipPath.replace('.zip', '')}", "zip", "${pkgDir}")`;
      await execAsync(`python3 -c '${pyZip}'`);
    }

    if (fs.existsSync(zipPath)) {
      const fileBuffer = fs.readFileSync(zipPath);
      const stat = fs.statSync(zipPath);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="Goi_Dang_Bai_${productId}.zip"`,
          'Content-Length': stat.size.toString(),
          'Cache-Control': 'no-cache',
        },
      });
    }

    return new NextResponse('Failed to generate ZIP package', { status: 500 });
  } catch (err: any) {
    return new NextResponse(err.message || 'Download error', { status: 500 });
  }
}
