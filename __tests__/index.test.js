// Dependencies
const assert = require('assert');
const path = require('path');
const mcg = require('../index');
const { stat, rmdir, mkdir, readFile } = require('../lib/helpers');
const { getTimestamp } = require('../lib/createRequiredFiles');
const {
	modelFileTemplate,
	migrationFileTemplate,
	testModelFileTemplate,
	testSeedDataFileTemplate,
} = require('../lib/templates');

describe('main', () => {
	const rootDir = path.join(process.cwd(), 'testApp');
	beforeAll(async () => {
		await mkdir(rootDir);
		return await mcg('Post', rootDir);
	});

	afterAll(async () => {
		return await rmdir(rootDir, { recursive: true });
	});

	const checkFileExists = async (filePath) => {
		const check = await stat(filePath);
		assert(check.isFile());
	};

	const checkDirectoryExists = async (directories) => {
		const fullPath = path.join(rootDir, ...directories);
		const check = await stat(fullPath);
		assert(check.isDirectory());
	};

	const checkFileExistsAndContentIsExpected = async ({
		filePath,
		expectedContent,
	}) => {
		await checkFileExists(filePath);
		const fileContent = await readFile(filePath);
		assert.equal(fileContent, expectedContent);
	};

	const fileAndContentCheckWrapper = async ({
		filePathElements,
		expectedContent,
	}) => {
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

	describe('when the __tests__/models folder does not yet exist', () => {
		it('should create the __tests__/models folder', async () => {
			await checkDirectoryExists(['__tests__', 'models']);
		});
	});

	describe('when the __tests__/data folder does not yet exist', () => {
		it('should create the __tests__/data folder', async () => {
			await checkDirectoryExists(['__tests__', 'data']);
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
			expectedContent: modelFileTemplate('Post'),
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

	it('should create the test model file inside the __tests__/models/ folder', async () => {
		return await fileAndContentCheckWrapper({
			filePathElements: ['__tests__', 'models', 'Post.test.js'],
			expectedContent: testModelFileTemplate('Post'),
		});
	});

	it('should create the test seed model file inside the __tests__/data/ folder', async () => {
		return await fileAndContentCheckWrapper({
			filePathElements: ['__tests__', 'data', 'seedPost.js'],
			expectedContent: testSeedDataFileTemplate('Post'),
		});
	});
});
