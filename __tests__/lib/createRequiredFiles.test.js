const assert = require('assert');
const path = require('path');
const {
	createModelFile,
	createMigrationFile,
	createTestModelFile,
	getTimestamp,
	createTestSeedDataFile,
} = require('../../lib/createRequiredFiles');
const { createFolderUnlessExists } = require('../../lib/createRequiredFolders');
const { stat, rmdir, readFile } = require('../../lib/helpers');

Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
	value: function () {
		function pad2(n) {
			// always returns a string
			return (n < 10 ? '0' : '') + n;
		}

		return (
			this.getFullYear() +
			pad2(this.getMonth() + 1) +
			pad2(this.getDate()) +
			pad2(this.getHours()) +
			pad2(this.getMinutes()) +
			pad2(this.getSeconds())
		);
	},
});

describe('createRequiredFiles', () => {
	const rootDir = path.join(process.cwd(), 'testApp');
	const modelName = 'Post';

	beforeAll(async () => {
		return await createFolderUnlessExists(rootDir);
	});

	afterAll(async () => {
		return await rmdir(rootDir, { recursive: true });
	});

	describe('#getTimestamp', () => {
		it('should return the timestamp identical to what Knex.js uses for migration filenames', async () => {
			const timestamp = getTimestamp();
			assert.equal(timestamp, new Date().YYYYMMDDHHMMSS());
		});
	});
	describe('#createModelFile', () => {
		it('should create the model file for the model', async () => {
			await createFolderUnlessExists(path.join(rootDir, 'models'));
			await createModelFile({ modelName, rootDir });
			const expectedFilePath = path.join(rootDir, 'models', 'Post.js');
			const exampleFilePath = path.join(
				process.cwd(),
				'__tests__',
				'data',
				'modelFileExample.test.js'
			);
			const fileCheck = await stat(expectedFilePath);
			assert(fileCheck.isFile());
			const fileContent = await readFile(expectedFilePath, {
				encoding: 'utf8',
			});
			const expectedFileContent = await readFile(exampleFilePath, {
				encoding: 'utf8',
			});
			assert.equal(fileContent, expectedFileContent);
		});
	});

	describe('#createMigrationFile', () => {
		it('should create the migration file for the model table', async () => {
			await createFolderUnlessExists(path.join(rootDir, 'migrations'));
			await createMigrationFile({ modelName, rootDir });
			const timestamp = getTimestamp();
			const expectedFilePath = path.join(
				rootDir,
				'migrations',
				`${timestamp}_create_posts_table.js`
			);
			const exampleFilePath = path.join(
				process.cwd(),
				'__tests__',
				'data',
				'migrationFileExample.test.js'
			);
			const fileCheck = await stat(expectedFilePath);
			assert(fileCheck.isFile());
			const fileContent = await readFile(expectedFilePath, {
				encoding: 'utf8',
			});
			const expectedFileContent = await readFile(exampleFilePath, {
				encoding: 'utf8',
			});
			assert.equal(fileContent, expectedFileContent);
		});
	});

	describe('#createTestModelFile', () => {
		it('should create the test model file for the model', async () => {
			const testFolder = '__tests__';
			await createFolderUnlessExists(path.join(rootDir, testFolder));
			await createFolderUnlessExists(
				path.join(rootDir, testFolder, 'models')
			);
			await createTestModelFile({
				modelName,
				rootDir,
				testFolder,
			});
			const expectedFilePath = path.join(
				rootDir,
				testFolder,
				'models',
				'Post.test.js'
			);
			const exampleFilePath = path.join(
				process.cwd(),
				testFolder,
				'data',
				'testModelFileExample.test.js'
			);
			const fileCheck = await stat(expectedFilePath);
			assert(fileCheck.isFile());
			const fileContent = await readFile(expectedFilePath, {
				encoding: 'utf8',
			});
			const expectedFileContent = await readFile(exampleFilePath, {
				encoding: 'utf8',
			});
			assert.equal(fileContent, expectedFileContent);
		});
	});

	describe('#createTestSeedDataFile', () => {
		it('should create the test data seed file for the model', async () => {
			const testFolder = '__tests__';
			await createFolderUnlessExists(path.join(rootDir, testFolder));
			await createFolderUnlessExists(
				path.join(rootDir, testFolder, 'data')
			);
			await createTestSeedDataFile({
				modelName,
				rootDir,
				testFolder,
			});
			const expectedFilePath = path.join(
				rootDir,
				testFolder,
				'data',
				'seedPost.js'
			);
			const exampleFilePath = path.join(
				process.cwd(),
				testFolder,
				'data',
				'testSeedDataFileExample.test.js'
			);
			const fileCheck = await stat(expectedFilePath);
			assert(fileCheck.isFile());
			const fileContent = await readFile(expectedFilePath, {
				encoding: 'utf8',
			});
			const expectedFileContent = await readFile(exampleFilePath, {
				encoding: 'utf8',
			});
			assert.equal(fileContent, expectedFileContent);
		});
	});

	describe('#createRequiredFiles', () => {
		it.todo('should create the required files for the model');
		it.todo(
			'should support creating those files in a custom root directory'
		);
		it.todo(
			'should support creating the test files in a custom test folder'
		);
		it.todo('should return a list of the files created');
	});
});
