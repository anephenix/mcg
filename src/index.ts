import pluralize from "pluralize";
import to from "to-case";
import { parseAttributes } from "./lib/attributes.js";
import { createRequiredFiles, createRequiredFolders } from "./lib/index.js";

export interface MainOptions {
	modelName: string;
	rootDir?: string;
	testFolder?: string;
	tableName?: string;
	attributes?: string[];
}

const main = async (
	modelName: string,
	rootDir: string = process.cwd(),
	testFolder: string = "test",
	tableName?: string | undefined,
	rawAttributes?: string[],
): Promise<ReturnType<typeof createRequiredFiles>> => {
	await createRequiredFolders({ rootDir, testFolder });
	if (!tableName) tableName = pluralize(to.snake(modelName));
	const attributes = parseAttributes(rawAttributes);
	return await createRequiredFiles({
		modelName,
		rootDir,
		testFolder,
		tableName,
		attributes,
	});
};

export default main;
