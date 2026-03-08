#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import util from "node:util";
import { program } from "commander";
import packageJson from "../../package.json" with { type: "json" };
import main from "../index.js";

// Helper types
type ConfigFile = Record<string, any>;

// Helper functions
const exists = util.promisify(fs.exists);

const loadConfigFileIfExists = async (): Promise<ConfigFile> => {
	const configFilePath = path.join(process.cwd(), "mcg.config.cjs");
	const configFileExists = await exists(configFilePath);
	if (!configFileExists) return {};

	console.log(`Using configuration settings found at ${configFilePath}`);
	const configModule = await import(configFilePath);
	return configModule.default || configModule;
};

const mainAction = async (modelName: string) => {
	const options = program.opts();
	const configFileOptions = await loadConfigFileIfExists();

	const testFolder = options.testFolder || configFileOptions.testFolder;
	const mainDir = options.mainDir || configFileOptions.mainDir || process.cwd();
	const tableName = options.tableName || configFileOptions.tableName;

	const filesCreated = await main(modelName, mainDir, testFolder, tableName);
	console.log("Created files:");
	filesCreated.forEach((fc: string) => console.log(fc));
};

const programSetup = () => {
	program
		.version(packageJson.version)
		.option(
			"-t, --testFolder <testFolder>",
			"custom folder for the test files to be put in",
		)
		.option(
			"-m, --mainDir <mainDir>",
			"the main folder for the files to be generated in",
		)
		.option(
			"-a, --attributes <attributes...>",
			"the attributes to insert into the model",
		)
		.option("-d, --tableName <tableName>", "the name of the database table")
		.arguments("<modelName>")
		.action(mainAction);
};

programSetup();
program.parse();
