import sharp from 'sharp';

interface OptimizeOptions {
  maxWidth?: number;
  quality?: number;
}

/**
 * Converts image buffer to WebP, resizes to maxWidth, saves to outputPath.
 * outputPath must NOT include extension — .webp is appended automatically.
 * Returns full path to saved file.
 */
export async function saveOptimizedImage(
  buffer: Buffer,
  outputPathWithoutExt: string,
  options: OptimizeOptions = {}
): Promise<string> {
  const { maxWidth = 1920, quality = 85 } = options;
  const webpPath = outputPathWithoutExt + '.webp';

  await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(webpPath);

  return webpPath;
}
