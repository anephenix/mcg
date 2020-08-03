const assert = require('assert');
const path = require('path');
const { exec, mkdir, rmdir, stat, unlink } = require('../../lib/helpers');
const { getTimestamp } = require('../../lib/createRequiredFiles');

describe('mcg', () => {
	it('should generate the files and folders for a new model', async () => {
		const command = './bin/mcg Post';
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			'__tests__/models/Post.test.js',
			'__tests__/data/postData.test.js',
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
		await rmdir(path.join(process.cwd(), '__tests__', 'models'), {
			recursive: true,
		});
	});

	it('should generate the test files in a custom folder, if a custom test folder is passed', async () => {
		const command = './bin/mcg Post --testFolder test';
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			'test/models/Post.test.js',
			'test/data/postData.test.js',
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
		await rmdir(path.join(process.cwd(), 'test'), {
			recursive: true,
		});
	});

	it('should generate the files in a custom main directory, if a custom main directory is passed', async () => {
		const mainDir = path.join(process.cwd(),'sixthApp');
		await mkdir(mainDir);
		const command = `./bin/mcg Post --mainDir ${mainDir}`;
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			'__tests__/models/Post.test.js',
			'__tests__/data/postData.test.js',
			'models/Post.js',
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(mainDir, fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(mainDir), { recursive: true });
	});
});
