const pluralize = require('pluralize');
const to = require('to-case');
const { createRequiredFolders, createRequiredFiles } = require('./lib');

const main = async (
	modelName,
	rootDir = process.cwd(),
	testFolder = 'test',
	tableName
) => {
	await createRequiredFolders({ rootDir, testFolder });
	if (!tableName) tableName = pluralize(to.snake(modelName));
	return await createRequiredFiles({
		modelName,
		rootDir,
		testFolder,
		tableName,
	});
};

module.exports = main;
