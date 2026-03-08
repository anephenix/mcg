import * as path from 'node:path';
// NOTE - start her
import mcg from '../dist/index';
import { stat, rm, mkdir, readFile } from '../src/lib/helpers';
import { getTimestamp } from '../src/lib/createRequiredFiles';
import {
	modelFileTemplate,
	migrationFileTemplate,
	testModelFileTemplate,
	testSeedDataFileTemplate,
} from '../src/lib/templates';
import { describe, beforeAll, afterAll, expect, it } from 'vitest';

describe('main', () => {
	const rootDir = path.join(process.cwd(), 'testApp');
	beforeAll(async () => {
		await mkdir(rootDir);
		return await mcg('Post', rootDir);
	});

	afterAll(async () => {
		await rm(rootDir, { recursive: true });
	});

	const checkFileExists = async (filePath: string): Promise<void> => {
		const check = await stat(filePath);
		expect(check.isFile()).toBe(true);
	};

	const checkDirectoryExists = async (
		directories: string[]
	): Promise<void> => {
		const fullPath = path.join(rootDir, ...directories);
		const check = await stat(fullPath);
		expect(check.isDirectory()).toBe(true);
	};

	interface FileAndContentCheck {
		filePath: string;
		expectedContent: string;
	}

	const checkFileExistsAndContentIsExpected = async ({
		filePath,
		expectedContent,
	}: FileAndContentCheck): Promise<void> => {
		await checkFileExists(filePath);
		const fileContent = await readFile(filePath);
		expect(fileContent.toString('utf8')).toBe(expectedContent);
	};

	interface FileAndContentCheckWrapper {
		filePathElements: string[];
		expectedContent: string;
	}

	const fileAndContentCheckWrapper = async ({
		filePathElements,
		expectedContent,
	}: FileAndContentCheckWrapper): Promise<void> => {
		const filePath = path.join(rootDir, ...filePathElements);
		await checkFileExistsAndContentIsExpected({
			filePath,
			expectedContent,
		});
	};

	describe('when the models folder does not yet exist', () => {
		it('should create the models folder', async () => {
			await checkDirectoryExists(['models']);
		});
	});

	describe('when the test/models folder does not yet exist', () => {
		it('should create the test/models folder', async () => {
			await checkDirectoryExists(['test', 'models']);
		});
	});

	describe('when the test/data folder does not yet exist', () => {
		it('should create the test/data folder', async () => {
			await checkDirectoryExists(['test', 'data']);
		});
	});

	describe('when the migration folder does not yet exist', () => {
		it('should create the migrations folder', async () => {
			await checkDirectoryExists(['migrations']);
		});
	});

	it('should create the model file inside the models folder', async () => {
		return await fileAndContentCheckWrapper({
			filePathElements: ['models', 'Post.js'],
			expectedContent: modelFileTemplate({
				modelName: 'Post',
				tableName: 'posts',
			}),
		});
	});

	it('should create the migration file inside the migrations folder', async () => {
		return await fileAndContentCheckWrapper({
			filePathElements: [
				'migrations',
				`${getTimestamp()}_create_posts_table.js`,
			],
			expectedContent: migrationFileTemplate('posts'),
		});
	});

	it('should create the test model file inside the test/models/ folder', async () => {
		return await fileAndContentCheckWrapper({
			filePathElements: ['test', 'models', 'Post.test.js'],
			expectedContent: testModelFileTemplate('Post'),
		});
	});

	it('should create the test seed model file inside the test/data/ folder', async () => {
		return await fileAndContentCheckWrapper({
			filePathElements: ['test', 'data', 'postData.test.js'],
			expectedContent: testSeedDataFileTemplate('Post'),
		});
	});
});
