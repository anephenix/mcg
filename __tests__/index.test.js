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

	describe('when the models folder does not yet exist', () => {
		it('should create the models folder', async () => {
			const modelsPath = path.join(rootDir, 'models');
			const check = await stat(modelsPath);
			assert(check.isDirectory());
		});
	});

	describe('when the __tests__/models folder does not yet exist', () => {
		it('should create the __tests__/models folder', async () => {
			const testModelsPath = path.join(rootDir, '__tests__', 'models');
			const check = await stat(testModelsPath);
			assert(check.isDirectory());
		});
	});

	describe('when the __tests__/data folder does not yet exist', () => {
		it('should create the __tests__/data folder', async () => {
			const testDataPath = path.join(rootDir, '__tests__', 'data');
			const check = await stat(testDataPath);
			assert(check.isDirectory());
		});
	});

	describe('when the migration folder does not yet exist', () => {
		it('should create the migrations folder', async () => {
			const migrationsPath = path.join(rootDir, 'migrations');
			const check = await stat(migrationsPath);
			assert(check.isDirectory());
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
