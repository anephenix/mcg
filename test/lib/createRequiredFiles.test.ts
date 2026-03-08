import * as path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	createMigrationFile,
	createModelFile,
	createRequiredFiles,
	createTestModelFile,
	createTestSeedDataFile,
	getTimestamp,
} from "../../src/lib/createRequiredFiles";
import {
	createFolderUnlessExists,
	createRequiredFolders,
} from "../../src/lib/createRequiredFolders";
import { mkdir, readFile, rmdir, stat } from "../../src/lib/helpers";

// Add a type for the custom Date prototype method
declare global {
	interface Date {
		YYYYMMDDHHMMSS(): string;
	}
}

Object.defineProperty(Date.prototype, "YYYYMMDDHHMMSS", {
	value: function () {
		function pad2(n: number): string {
			// always returns a string
			return (n < 10 ? "0" : "") + n;
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

describe("createRequiredFiles", () => {
	const rootDir = path.join(process.cwd(), "testApp");
	const modelName = "Post";
	const tableName = "posts";

	beforeAll(async () => {
		return await createFolderUnlessExists(rootDir);
	});

	afterAll(async () => {
		await rmdir(rootDir, { recursive: true });
	});

	const createRequiredFolder = async (
		testFolder: string,
		folders: string[],
	): Promise<void> => {
		await createFolderUnlessExists(path.join(rootDir, testFolder));
		return await createFolderUnlessExists(
			path.join(rootDir, testFolder, ...folders),
		);
	};

	interface CompareExpectedAndActualFilesOptions {
		expectedFilePathFolders: string[];
		exampleFileName: string;
	}

	const compareExpectedAndActualFiles = async ({
		expectedFilePathFolders,
		exampleFileName,
	}: CompareExpectedAndActualFilesOptions): Promise<void> => {
		const expectedFilePath = path.join(rootDir, ...expectedFilePathFolders);
		const exampleFilePath = path.join(
			process.cwd(),
			"test",
			"data",
			exampleFileName,
		);
		const fileCheck = await stat(expectedFilePath);
		expect(fileCheck.isFile()).toBe(true);
		const fileContent = await readFile(expectedFilePath, {
			encoding: "utf8",
		});
		const expectedFileContent = await readFile(exampleFilePath, {
			encoding: "utf8",
		});
		expect(fileContent).toBe(expectedFileContent);
	};

	describe("#getTimestamp", () => {
		it("should return the timestamp identical to what Knex.js uses for migration filenames", async () => {
			const timestamp = getTimestamp();
			expect(timestamp).toBe(new Date().YYYYMMDDHHMMSS());
		});
	});
	describe("#createModelFile", () => {
		it("should create the model file for the model", async () => {
			await createFolderUnlessExists(path.join(rootDir, "models"));
			await createModelFile({ modelName, rootDir, tableName });
			return await compareExpectedAndActualFiles({
				expectedFilePathFolders: ["models", "Post.js"],
				exampleFileName: "modelFileExample.test.js",
			});
		});
	});

	describe("#createMigrationFile", () => {
		it("should create the migration file for the model table", async () => {
			await createFolderUnlessExists(path.join(rootDir, "migrations"));
			await createMigrationFile({ tableName, rootDir });
			const timestamp = getTimestamp();
			return await compareExpectedAndActualFiles({
				expectedFilePathFolders: [
					"migrations",
					`${timestamp}_create_posts_table.js`,
				],
				exampleFileName: "migrationFileExample.test.js",
			});
		});
	});

	describe("#createTestModelFile", () => {
		it("should create the test model file for the model", async () => {
			await createRequiredFolder("test", ["models"]);
			await createTestModelFile({
				modelName,
				rootDir,
				testFolder: "test",
			});
			return await compareExpectedAndActualFiles({
				expectedFilePathFolders: ["test", "models", "Post.test.js"],
				exampleFileName: "testModelFileExample.test.js",
			});
		});
	});

	describe("#createTestSeedDataFile", () => {
		it("should create the test data seed file for the model", async () => {
			await createRequiredFolder("test", ["data"]);
			await createTestSeedDataFile({
				modelName,
				rootDir,
				testFolder: "test",
			});
			return await compareExpectedAndActualFiles({
				expectedFilePathFolders: ["test", "data", "postData.test.js"],
				exampleFileName: "testSeedDataFileExample.test.js",
			});
		});
	});

	describe("#createRequiredFiles", () => {
		const anotherRootDir = path.join(process.cwd(), "secondTestApp");
		const testFolder = "spec";
		let expectedFiles: string[] = [];
		let result: string[] | null = null;

		beforeAll(async () => {
			await mkdir(anotherRootDir);
			await createRequiredFolders({
				rootDir: anotherRootDir,
				testFolder,
			});
			const timeStamp = getTimestamp();
			expectedFiles = [
				"/models/Post.js",
				`/migrations/${timeStamp}_create_posts_table.js`,
				`/${testFolder}/models/Post.test.js`,
				`/${testFolder}/data/postData.test.js`,
			];
			result = await createRequiredFiles({
				modelName: "Post",
				rootDir: anotherRootDir,
				testFolder,
				tableName,
			});
		});

		afterAll(async () => {
			await rmdir(anotherRootDir, { recursive: true });
		});

		it("should create the required files for the model", async () => {
			for await (const file of expectedFiles) {
				await stat(anotherRootDir + file);
			}
		});
		it("should support creating those files in a custom root directory", () => {
			expect(rootDir).not.toBe(anotherRootDir);
			expect(process.cwd()).not.toBe(anotherRootDir);
			expect(anotherRootDir.match("testApp")).toBe(null);
		});
		it("should support creating the test files in a custom test folder", () => {
			for (const file of expectedFiles) {
				expect(file.match("test/")).toBe(null);
			}
		});
		it("should return a list of the files created", () => {
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(4);
			for (const file of expectedFiles) {
				expect(result.indexOf(anotherRootDir + file) >= 0).toBe(true);
			}
		});
	});
});
