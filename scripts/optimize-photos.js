import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const PHOTOS_DIR = 'static/images/photos';
const MAX_SIZE = 480; // 2x the 240px display size for retina
const QUALITY = 80;

async function optimizePhotos() {
	const files = await readdir(PHOTOS_DIR);
	const webpFiles = files.filter((f) => f.endsWith('.webp'));

	for (const file of webpFiles) {
		const filepath = join(PHOTOS_DIR, file);
		const image = sharp(filepath);
		const metadata = await image.metadata();

		console.log(`\n${file}:`);
		console.log(`  Original: ${metadata.width}x${metadata.height}`);

		// Only resize if larger than MAX_SIZE
		if (metadata.width > MAX_SIZE || metadata.height > MAX_SIZE) {
			await image
				.resize(MAX_SIZE, MAX_SIZE, {
					fit: 'inside',
					withoutEnlargement: true
				})
				.webp({ quality: QUALITY })
				.toFile(filepath + '.tmp');

			// Replace original
			const { rename, stat } = await import('fs/promises');
			const origSize = (await stat(filepath)).size;
			const newSize = (await stat(filepath + '.tmp')).size;

			await rename(filepath + '.tmp', filepath);

			console.log(`  Resized to: ${MAX_SIZE}px max`);
			console.log(`  Size: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB`);
		} else {
			// Just recompress at lower quality
			await image.webp({ quality: QUALITY }).toFile(filepath + '.tmp');

			const { rename, stat } = await import('fs/promises');
			const origSize = (await stat(filepath)).size;
			const newSize = (await stat(filepath + '.tmp')).size;

			if (newSize < origSize) {
				await rename(filepath + '.tmp', filepath);
				console.log(`  Recompressed: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB`);
			} else {
				const { unlink } = await import('fs/promises');
				await unlink(filepath + '.tmp');
				console.log(`  Already optimized (${(origSize / 1024).toFixed(0)}KB)`);
			}
		}
	}

	console.log('\nDone!');
}

optimizePhotos().catch(console.error);
