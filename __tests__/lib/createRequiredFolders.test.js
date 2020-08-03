const path = require('path');
const assert = require('assert');
const {
	createFolderUnlessExists,
	createRequiredFolders,
} = require('../../lib/createRequiredFolders');
const { stat, rmdir, mkdir } = require('../../lib/helpers');

const checkFolderExists = async (folders) => {
	const folderCheck = await stat(path.join(...folders));
	assert(folderCheck.isDirectory());
};

describe('createRequiredFolders', () => {
	describe('#createRequiredFolders', () => {
		const rootDir = path.join(process.cwd(), 'thirdTestApp');
		const testFolder = '__tests__';

		beforeAll(async () => {
			await mkdir(rootDir);
			await createRequiredFolders({
				rootDir,
				testFolder,
			});
		});

		afterAll(async () => {
			await rmdir(rootDir, { recursive: true });
		});

		it('should create a models folder', async () => {
			return await checkFolderExists([rootDir, 'models']);
		});
		it('should create a migrations folder', async () => {
			return await checkFolderExists([rootDir, 'migrations']);
		});
		it('should create a __tests__ folder', async () => {
			return await checkFolderExists([rootDir, '__tests__']);
		});
		it('should create a __tests__/models folder', async () => {
			return await checkFolderExists([rootDir, '__tests__', 'models']);
		});
		it('should create a __tests__/data folder', async () => {
			return await checkFolderExists([rootDir, '__tests__', 'data']);
		});

		it('should create the folders in a custom root directory if one is specified', async () => {
			assert.notEqual(process.cwd(), rootDir);
			assert(rootDir.match('thirdTestApp') !== null);
		});
		it('should create the test-related folders with a custom test folder name if specified', async () => {
			const anotherRootDir = path.join(process.cwd(), 'fourthTestApp');
			const anotherTestFolder = 'test';
			await mkdir(anotherRootDir);
			await createRequiredFolders({
				rootDir: anotherRootDir,
				testFolder: anotherTestFolder,
			});
			await checkFolderExists([anotherRootDir, 'test']);
			await rmdir(anotherRootDir, { recursive: true });
		});
	});

	describe('#createFolderUnlessExists', () => {
		it('should create the folder if it does not exist', async () => {
			const folderPathToCreate = path.join(process.cwd(), 'serpentine');
			try {
				await stat(folderPathToCreate);
				assert(false, 'This line should not be reached');
			} catch {
				await createFolderUnlessExists(folderPathToCreate);
				await checkFolderExists([folderPathToCreate]);
				await rmdir(folderPathToCreate);
			}
		});
		it('should return folder if the folder exists already', async () => {
			const folderPathToNotCreate = path.join(process.cwd(), 'gallery');
			await mkdir(folderPathToNotCreate);
			await checkFolderExists([folderPathToNotCreate]);
			await createFolderUnlessExists(folderPathToNotCreate);
			await rmdir(folderPathToNotCreate);
		});
	});
});
