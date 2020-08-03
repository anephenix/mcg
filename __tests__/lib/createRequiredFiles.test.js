const assert = require('assert');
const path = require('path');
const {
	createModelFile,
	createMigrationFile,
	createTestModelFile,
	getTimestamp,
	createTestSeedDataFile,
	createRequiredFiles,
} = require('../../lib/createRequiredFiles');
const {
	createFolderUnlessExists,
	createRequiredFolders,
} = require('../../lib/createRequiredFolders');
const { stat, rmdir, readFile, mkdir } = require('../../lib/helpers');

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

	const createRequiredFolder = async (testFolder, folders) => {
		await createFolderUnlessExists(path.join(rootDir, testFolder));
		return await createFolderUnlessExists(
			path.join(rootDir, testFolder, ...folders)
		);
	};

	const compareExpectedAndActualFiles = async ({
		expectedFilePath,
		exampleFilePath,
	}) => {
		const fileCheck = await stat(expectedFilePath);
		assert(fileCheck.isFile());
		const fileContent = await readFile(expectedFilePath, {
			encoding: 'utf8',
		});
		const expectedFileContent = await readFile(exampleFilePath, {
			encoding: 'utf8',
		});
		assert.equal(fileContent, expectedFileContent);
	};

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
			return await compareExpectedAndActualFiles({
				expectedFilePath,
				exampleFilePath,
			});
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
			return await compareExpectedAndActualFiles({
				expectedFilePath,
				exampleFilePath,
			});
		});
	});

	describe('#createTestModelFile', () => {
		it('should create the test model file for the model', async () => {
			const testFolder = '__tests__';
			await createRequiredFolder(testFolder, ['models']);
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
			return await compareExpectedAndActualFiles({
				expectedFilePath,
				exampleFilePath,
			});
		});
	});

	describe('#createTestSeedDataFile', () => {
		it('should create the test data seed file for the model', async () => {
			const testFolder = '__tests__';
			await createRequiredFolder(testFolder, ['data']);
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
			return await compareExpectedAndActualFiles({
				expectedFilePath,
				exampleFilePath,
			});
		});
	});

	describe('#createRequiredFiles', () => {
		const anotherRootDir = path.join(process.cwd(), 'secondTestApp');
		const testFolder = 'test';
		let expectedFiles = null;
		let result = null;

		beforeAll(async () => {
			await mkdir(anotherRootDir);
			await createRequiredFolders({
				rootDir: anotherRootDir,
				testFolder,
			});
			const timeStamp = getTimestamp();
			expectedFiles = [
				'/models/Post.js',
				`/migrations/${timeStamp}_create_posts_table.js`,
				`/${testFolder}/models/Post.test.js`,
				`/${testFolder}/data/seedPost.js`,
			];
			result = await createRequiredFiles({
				modelName: 'Post',
				rootDir: anotherRootDir,
				testFolder,
			});
		});

		afterAll(async () => {
			await rmdir(anotherRootDir, { recursive: true });
		});

		it('should create the required files for the model', async () => {
			for await (const file of expectedFiles) {
				await stat(anotherRootDir + file);
			}
		});
		it('should support creating those files in a custom root directory', () => {
			assert.notEqual(rootDir, anotherRootDir);
			assert.notEqual(process.cwd(), anotherRootDir);
			assert(anotherRootDir.match('secondTestApp') !== null);
		});
		it('should support creating the test files in a custom test folder', () => {
			for (const file of expectedFiles) {
				assert(file.match('__tests__') === null);
			}
		});
		it('should return a list of the files created', () => {
			assert(result instanceof Array);
			assert.equal(result.length, 4);
			for (const file of expectedFiles) {
				assert(result.indexOf(anotherRootDir + file) !== -1);
			}
		});
	});
});
