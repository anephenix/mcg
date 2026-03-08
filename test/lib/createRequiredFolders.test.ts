import * as path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	createFolderUnlessExists,
	createRequiredFolders,
} from "../../src/lib/createRequiredFolders";
import { mkdir, rmdir, stat } from "../../src/lib/helpers";

const checkFolderExists = async (folders: string[]): Promise<void> => {
	const folderCheck = await stat(path.join(...folders));
	expect(folderCheck.isDirectory()).toBe(true);
};

describe("createRequiredFolders", () => {
	describe("#createRequiredFolders", () => {
		const rootDir = path.join(process.cwd(), "thirdTestApp");
		const testFolder = "test";

		beforeAll(async () => {
			await mkdir(rootDir);
			return await createRequiredFolders({
				rootDir,
				testFolder,
			});
		});

		afterAll(async () => await rmdir(rootDir, { recursive: true }));

		it("should create a models folder", async () => {
			return await checkFolderExists([rootDir, "models"]);
		});
		it("should create a migrations folder", async () => {
			return await checkFolderExists([rootDir, "migrations"]);
		});
		it("should create a test folder", async () => {
			return await checkFolderExists([rootDir, "test"]);
		});
		it("should create a test/models folder", async () => {
			return await checkFolderExists([rootDir, "test", "models"]);
		});
		it("should create a test/data folder", async () => {
			return await checkFolderExists([rootDir, "test", "data"]);
		});

		it("should create the folders in a custom root directory if one is specified", async () => {
			expect(process.cwd()).not.toBe(rootDir);
			expect(rootDir.match("thirdTestApp")).not.toBe(null);
		});
		it("should create the test-related folders with a custom test folder name if specified", async () => {
			const anotherRootDir = path.join(process.cwd(), "fourthTestApp");
			const anotherTestFolder = "test";
			await mkdir(anotherRootDir);
			await createRequiredFolders({
				rootDir: anotherRootDir,
				testFolder: anotherTestFolder,
			});
			await checkFolderExists([anotherRootDir, "test"]);
			await rmdir(anotherRootDir, { recursive: true });
		});
	});

	describe("#createFolderUnlessExists", () => {
		it("should create the folder if it does not exist", async () => {
			const folderPathToCreate = path.join(process.cwd(), "serpentine");
			try {
				await stat(folderPathToCreate);
				expect(false, "This line should not be reached");
			} catch {
				await createFolderUnlessExists(folderPathToCreate);
				await checkFolderExists([folderPathToCreate]);
				await rmdir(folderPathToCreate, { recursive: true });
			}
		});
		it("should return folder if the folder exists already", async () => {
			const folderPathToNotCreate = path.join(process.cwd(), "gallery");
			await mkdir(folderPathToNotCreate);
			await checkFolderExists([folderPathToNotCreate]);
			await createFolderUnlessExists(folderPathToNotCreate);
			await rmdir(folderPathToNotCreate, { recursive: true });
		});
	});
});
