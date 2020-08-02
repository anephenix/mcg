const assert = require('assert');
const path = require('path');
const {
	createModelFile,
	getTimestamp,
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
	describe('#getTimestamp', () => {
		it('should return the timestamp identical to what Knex.js uses for migration filenames', async () => {
			const timestamp = getTimestamp();
			assert.equal(timestamp, new Date().YYYYMMDDHHMMSS());
		});
	});
	describe('#createModelFile', () => {
		const rootDir = path.join(process.cwd(), 'testApp');

		afterEach(async () => {
			return await rmdir(rootDir, { recursive: true });
		});

		it('should create the model file for the model', async () => {
			const modelName = 'Post';
			const rootDir = path.join(process.cwd(), 'testApp');
			await createFolderUnlessExists(rootDir);
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
		it.todo('should create the migration file for the model table');
	});

	describe('#createTestModelFile', () => {
		it.todo('should create the test model file for the model');
	});

	describe('#createTestSeedDataFile', () => {
		it.todo('should create the test data seed file for the model');
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
