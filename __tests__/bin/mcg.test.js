const assert = require('assert');
const path = require('path');
const { exec, rmdir, stat, unlink } = require('../../lib/helpers');
const { getTimestamp } = require('../../lib/createRequiredFiles');

describe('mcg', () => {
	it('should generate the files and folders for a new model', async () => {
		const command = './bin/mcg Post';
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			'__tests__/models/Post.test.js',
			'__tests__/data/seedPost.js',
			'models/Post.js',
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(process.cwd(), fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(process.cwd(), 'models'), { recursive: true });
		await rmdir(path.join(process.cwd(), 'migrations'), {
			recursive: true,
		});
		await rmdir(path.join(process.cwd(), '__tests__', 'migrations'), {
			recursive: true,
		});
	});
});
