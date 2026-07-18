import { access } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const outputDirectory = join(process.cwd(), 'public', 'portraits');
const people = ['david', 'eva'];
const widths = [640, 960, 1280];
const formats = ['avif', 'webp', 'jpg'];
const missing = [];

for (const person of people) {
  for (const width of widths) {
    for (const format of formats) {
      const file = join(outputDirectory, `${person}-${width}.${format}`);
      try {
        await access(file);
        const metadata = await sharp(file).metadata();
        if (metadata.width !== width || !metadata.height) {
          missing.push(`${file} (expected a valid image ${width} px wide)`);
        }
      } catch {
        missing.push(file);
      }
    }
  }
}

if (missing.length > 0) {
  console.error('Portrait derivatives are missing or invalid:');
  for (const file of missing) console.error(`- ${file}`);
  console.error(
    '\nAdd .portrait-source/david.* and .portrait-source/eva.*, then run npm run portraits:prepare.',
  );
  process.exitCode = 1;
} else {
  console.log('All responsive portrait derivatives are present and valid.');
}
