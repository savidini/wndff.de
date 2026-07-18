import { readdir, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const sourceDirectory = join(process.cwd(), '.portrait-source');
const outputDirectory = join(process.cwd(), 'public', 'portraits');
const people = ['david', 'eva'];
const widths = [640, 960, 1280];
const allowedExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.tif',
  '.tiff',
  '.webp',
]);

async function findSource(person) {
  let entries;
  try {
    entries = await readdir(sourceDirectory, { withFileTypes: true });
  } catch {
    throw new Error(
      `Missing ${sourceDirectory}. Create it and add one high-resolution original named ${person}.jpg (or PNG/TIFF/WebP).`,
    );
  }

  const matches = entries.filter(
    (entry) =>
      entry.isFile() &&
      entry.name.slice(0, -extname(entry.name).length).toLowerCase() ===
        person &&
      allowedExtensions.has(extname(entry.name).toLowerCase()),
  );

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one source portrait for ${person} in ${sourceDirectory}; found ${matches.length}.`,
    );
  }

  return join(sourceDirectory, matches[0].name);
}

async function prepare(person) {
  const source = await findSource(person);
  const image = sharp(source, { failOn: 'warning' }).rotate();
  const metadata = await image.metadata();

  if (
    !metadata.width ||
    !metadata.height ||
    Math.min(metadata.width, metadata.height) < 1200
  ) {
    throw new Error(
      `${person}'s portrait must be high resolution (at least 1200 px on its shorter edge).`,
    );
  }

  for (const width of widths) {
    const base = sharp(source, { failOn: 'warning' })
      .rotate()
      .resize({ width });

    await Promise.all([
      base
        .clone()
        .avif({ quality: 63, effort: 6 })
        .toFile(join(outputDirectory, `${person}-${width}.avif`)),
      base
        .clone()
        .webp({ quality: 78, effort: 6 })
        .toFile(join(outputDirectory, `${person}-${width}.webp`)),
      base
        .clone()
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(join(outputDirectory, `${person}-${width}.jpg`)),
    ]);
  }

  console.log(`Prepared responsive portrait derivatives for ${person}.`);
}

await mkdir(outputDirectory, { recursive: true });
for (const person of people) await prepare(person);
