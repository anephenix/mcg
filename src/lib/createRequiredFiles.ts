import path from "node:path";
import to from "to-case";
import { writeFile } from "./helpers.js";
import {
	migrationFileTemplate,
	modelFileTemplate,
	testModelFileTemplate,
	testSeedDataFileTemplate,
} from "./templates/index.js";

const zeroPad = (number: number): string => {
	return number < 10 ? `0${number}` : number.toString();
};

export const getTimestamp = (): string => {
	const date = new Date();
	const year = date.getFullYear();
	const month = zeroPad(date.getMonth() + 1);
	const day = zeroPad(date.getDate());
	const hours = zeroPad(date.getHours());
	const minutes = zeroPad(date.getMinutes());
	const seconds = zeroPad(date.getSeconds());
	return [year, month, day, hours, minutes, seconds].join("");
};

export interface ModelFileOptions {
	modelName: string;
	rootDir: string;
	tableName: string;
}

export const createModelFile = async ({
	modelName,
	rootDir,
	tableName,
}: ModelFileOptions): Promise<string> => {
	const fileName = `${to.pascal(modelName)}.js`;
	const filePath = path.join(rootDir, "models", fileName);
	const fileContent = modelFileTemplate({
		modelName: to.pascal(modelName),
		tableName,
	});
	await writeFile(filePath, fileContent, { encoding: "utf8" });
	return filePath;
};

export interface MigrationFileOptions {
	tableName: string;
	rootDir: string;
}

export const createMigrationFile = async ({
	tableName,
	rootDir,
}: MigrationFileOptions): Promise<string> => {
	const fileName = `${getTimestamp()}_create_${tableName}_table.js`;
	const filePath = path.join(rootDir, "migrations", fileName);
	const fileContent = migrationFileTemplate(tableName);
	await writeFile(filePath, fileContent, { encoding: "utf8" });
	return filePath;
};

export interface TestModelFileOptions {
	modelName: string;
	rootDir: string;
	testFolder: string;
}

export const createTestModelFile = async ({
	modelName,
	rootDir,
	testFolder,
}: TestModelFileOptions): Promise<string> => {
	const fileName = `${to.pascal(modelName)}.test.js`;
	const filePath = path.join(rootDir, testFolder, "models", fileName);
	const fileContent = testModelFileTemplate(modelName);
	await writeFile(filePath, fileContent, { encoding: "utf8" });
	return filePath;
};

export interface TestSeedDataFileOptions {
	modelName: string;
	rootDir: string;
	testFolder: string;
}

export const createTestSeedDataFile = async ({
	modelName,
	rootDir,
	testFolder,
}: TestSeedDataFileOptions): Promise<string> => {
	const fileName = `${to.camel(modelName)}Data.test.js`;
	const filePath = path.join(rootDir, testFolder, "data", fileName);
	const fileContent = testSeedDataFileTemplate(modelName);
	await writeFile(filePath, fileContent, { encoding: "utf8" });
	return filePath;
};

export interface CreateRequiredFilesOptions {
	modelName: string;
	rootDir: string;
	testFolder: string;
	tableName: string;
}

export const createRequiredFiles = async ({
	modelName,
	rootDir,
	testFolder,
	tableName,
}: CreateRequiredFilesOptions): Promise<string[]> => {
	const files = await Promise.all([
		createModelFile({ modelName, rootDir, tableName }),
		createMigrationFile({ tableName, rootDir }),
		createTestModelFile({ modelName, rootDir, testFolder }),
		createTestSeedDataFile({ modelName, rootDir, testFolder }),
	]);
	return files;
};
