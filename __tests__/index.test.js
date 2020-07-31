// Dependencies
const assert = require('assert');
const path = require('path');
const mcg = require('../index');
const { stat, rmdir, mkdir } = require('../lib/helpers');

describe('main', () => {
	const rootDir = path.join(process.cwd(), 'testApp');
	beforeAll(async () => {
		await mkdir(rootDir);
		return await mcg('Post', rootDir);
	});

	afterAll(async () => {
		return await rmdir(rootDir, { recursive: true });
	});

	const checkDirectoryExists = async (directories) => {
		const fullPath = path.join(rootDir, ...directories);
		const check = await stat(fullPath);
		assert(check.isDirectory());
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

	it.todo('should create the model file inside the models folder');
	it.todo('should create the migration file inside the migrations folder');

	it.todo(
		'should create the test model file inside the __tests__/models/ folder'
	);

	it.todo(
		'should create the test seed model file inside the __tests__/data/ folder'
	);
});
