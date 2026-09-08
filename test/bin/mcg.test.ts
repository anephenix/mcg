import assert from "node:assert";
import * as path from "node:path";
import { describe, it } from "vitest";
import { getTimestamp } from "../../src/lib/createRequiredFiles";
import {
	exec,
	mkdir,
	readFile,
	rmdir,
	stat,
	unlink,
	writeFile,
} from "../../src/lib/helpers";

const shellEscape = (value: string): string =>
	`'${value.replace(/'/g, `'"'"'`)}'`;

interface CompareExpectedAndActualFilesOptions {
	rootDir: string;
	expectedFilePathFolders: string[];
	exampleFileName: string;
}

const compareExpectedAndActualFiles = async ({
	rootDir,
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
	assert(fileCheck.isFile());
	const fileContent = await readFile(expectedFilePath, {
		encoding: "utf8",
	});
	const expectedFileContent = await readFile(exampleFilePath, {
		encoding: "utf8",
	});
	assert.equal(fileContent, expectedFileContent);
};

describe("mcg", () => {
	it("should generate the files and folders for a new model", async () => {
		const command = "./dist/bin/mcg Post";
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			"test/models/Post.test.js",
			"test/data/postData.test.js",
			"models/Post.js",
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(process.cwd(), fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(process.cwd(), "models"), { recursive: true });
		await rmdir(path.join(process.cwd(), "migrations"), {
			recursive: true,
		});
		await rmdir(path.join(process.cwd(), "test", "models"), {
			recursive: true,
		});
	});

	it("should generate the test files in a custom folder, if a custom test folder is passed", async () => {
		const customTestFolder = "spec";
		const command = `./dist/bin/mcg Post --testFolder ${customTestFolder}`;
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			`${customTestFolder}/models/Post.test.js`,
			`${customTestFolder}/data/postData.test.js`,
			"models/Post.js",
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(process.cwd(), fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(process.cwd(), "models"), { recursive: true });
		await rmdir(path.join(process.cwd(), "migrations"), {
			recursive: true,
		});
		await rmdir(path.join(process.cwd(), customTestFolder), {
			recursive: true,
		});
	});

	it("should generate the files in a custom main directory, if a custom main directory is passed", async () => {
		const mainDir = path.join(process.cwd(), "sixthApp");
		await mkdir(mainDir);
		const command = `./dist/bin/mcg Post --mainDir ${mainDir}`;
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			"test/models/Post.test.js",
			"test/data/postData.test.js",
			"models/Post.js",
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(mainDir, fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(mainDir), { recursive: true });
	});

	it("should read any custom testDir and mainDir settings from a config file, if a config file is present", async () => {
		const configFilePath = path.join(process.cwd(), "mcg.config.cjs");
		const configFileData = `module.exports = { testFolder: 'spec' };`;
		await writeFile(configFilePath, configFileData);
		const command = "./dist/bin/mcg Post";
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			"spec/models/Post.test.js",
			"spec/data/postData.test.js",
			"models/Post.js",
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(process.cwd(), fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(process.cwd(), "models"), { recursive: true });
		await rmdir(path.join(process.cwd(), "migrations"), {
			recursive: true,
		});
		await rmdir(path.join(process.cwd(), "spec"), {
			recursive: true,
		});
		await unlink(configFilePath);
	});

	describe("custom tableName", () => {
		it("should allow the user to specify a custom table name for the model", async () => {
			const mainDir = path.join(process.cwd(), "seventhApp");
			await mkdir(mainDir);
			const tableName = "blog_posts";
			const command = `./dist/bin/mcg Post --mainDir ${shellEscape(mainDir)} --tableName ${shellEscape(tableName)}`;
			const { stdout } = await exec(command);
			const timestamp = getTimestamp();
			const filesToCheck = [
				"models/Post.js",
				`migrations/${timestamp}_create_blog_posts_table.js`,
			];
			for await (const fileToCheck of filesToCheck) {
				const filePath = path.join(mainDir, fileToCheck);
				const fileCheck = await stat(filePath);
				assert(fileCheck.isFile());
				assert(stdout.match(filePath) !== null);
				if (fileToCheck === "models/Post.js") {
					await compareExpectedAndActualFiles({
						rootDir: mainDir,
						expectedFilePathFolders: ["models", "Post.js"],
						exampleFileName: "modelFileWithCustomTableNameExample.test.js",
					});
				}
				if (
					fileToCheck === `migrations/${timestamp}_create_blog_posts_table.js`
				) {
					await compareExpectedAndActualFiles({
						rootDir: mainDir,
						expectedFilePathFolders: [
							"migrations",
							`${timestamp}_create_blog_posts_table.js`,
						],
						exampleFileName: "migrationFileWithCustomTableNameExample.test.js",
					});
				}

				await unlink(filePath);
			}
			await rmdir(path.join(mainDir), { recursive: true });
		});
	});

	describe("with attributes passed", () => {
		it("should generate a migration file, model file and test seed data file that include the given attributes", async () => {
			const mainDir = path.join(process.cwd(), "eighthApp");
			await mkdir(mainDir);
			const command = `./dist/bin/mcg Post --mainDir ${shellEscape(mainDir)} --attributes title:string description:text published:boolean`;
			const { stdout } = await exec(command);
			const timestamp = getTimestamp();
			const filesToCheck = [
				"models/Post.js",
				`migrations/${timestamp}_create_posts_table.js`,
				"test/data/postData.test.js",
			];
			for await (const fileToCheck of filesToCheck) {
				const filePath = path.join(mainDir, fileToCheck);
				const fileCheck = await stat(filePath);
				assert(fileCheck.isFile());
				assert(stdout.match(filePath) !== null);
			}
			await compareExpectedAndActualFiles({
				rootDir: mainDir,
				expectedFilePathFolders: ["models", "Post.js"],
				exampleFileName: "modelFileWithAttributesExample.test.js",
			});
			await compareExpectedAndActualFiles({
				rootDir: mainDir,
				expectedFilePathFolders: [
					"migrations",
					`${timestamp}_create_posts_table.js`,
				],
				exampleFileName: "migrationFileWithAttributesExample.test.js",
			});
			await compareExpectedAndActualFiles({
				rootDir: mainDir,
				expectedFilePathFolders: ["test", "data", "postData.test.js"],
				exampleFileName: "testSeedDataFileWithAttributesExample.test.js",
			});
			await rmdir(mainDir, { recursive: true });
		});

		it("should error out when an attribute is not in the name:type format", async () => {
			const mainDir = path.join(process.cwd(), "ninthApp");
			await mkdir(mainDir);
			const cmd = "./dist/bin/mcg";
			const args = ["Post", "--mainDir", mainDir, "--attributes", "title"];
			await assert.rejects(exec(cmd, args));
			await rmdir(mainDir, { recursive: true });
		});

		it("should error out when an attribute type is not supported", async () => {
			const mainDir = path.join(process.cwd(), "tenthApp");
			await mkdir(mainDir);
			const cmd = "./dist/bin/mcg";
			const args = [
				"Post",
				"--mainDir",
				mainDir,
				"--attributes",
				"title:unknownType",
			];
			await assert.rejects(exec(cmd, args));
			await rmdir(mainDir, { recursive: true });
		});
	});
});
