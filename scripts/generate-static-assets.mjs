import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const publicDirectory = join(process.cwd(), 'public');
const source = await readFile(join(publicDirectory, 'og-card.svg'));
await sharp(source)
  .png({ compressionLevel: 9, palette: true })
  .toFile(join(publicDirectory, 'og-card.png'));
console.log('Generated public/og-card.png.');
