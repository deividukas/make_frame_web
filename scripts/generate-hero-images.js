import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_PATH = '/tmp/hero-original.png';
const OUTPUT_DIR = path.join(__dirname, '../client/public/assets');

async function generateHeroImages() {
  console.log('Generating static hero images...');
  
  const image = sharp(INPUT_PATH);
  const metadata = await image.metadata();
  console.log(`Original: ${metadata.width}x${metadata.height}`);
  
  // Desktop AVIF (700px width for hero)
  await sharp(INPUT_PATH)
    .resize(700, null, { fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 80 })
    .toFile(path.join(OUTPUT_DIR, 'hero.avif'));
  console.log('Created: hero.avif');
  
  // Desktop WebP (700px width for hero)
  await sharp(INPUT_PATH)
    .resize(700, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(OUTPUT_DIR, 'hero.webp'));
  console.log('Created: hero.webp');
  
  // Mobile WebP (500px width)
  await sharp(INPUT_PATH)
    .resize(500, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(OUTPUT_DIR, 'hero-mobile.webp'));
  console.log('Created: hero-mobile.webp');
  
  console.log('Done! Static hero images generated.');
}

generateHeroImages().catch(console.error);
