import pluralize from 'pluralize';
import to from 'to-case';
import { createRequiredFolders, createRequiredFiles } from './lib/index.js';

export interface MainOptions {
	modelName: string;
	rootDir?: string;
	testFolder?: string;
	tableName?: string;
}

const main = async (
	modelName: string,
	rootDir: string = process.cwd(),
	testFolder: string = 'test',
	tableName?: string | undefined
): Promise<ReturnType<typeof createRequiredFiles>> => {
	await createRequiredFolders({ rootDir, testFolder });
	if (!tableName) tableName = pluralize(to.snake(modelName));
	return await createRequiredFiles({
		modelName,
		rootDir,
		testFolder,
		tableName,
	});
};

export default main;
