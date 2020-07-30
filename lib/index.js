const pluralize = require('pluralize');
const path = require('path');
const { stat, mkdir } = require('./promisifiedFunctions');

const createFolderUnlessExists = async (folderPath) => {
	const checkedFolder = await stat(folderPath);
	if (checkedFolder.isDirectory()) return;
	await mkdir(folderPath);
};

const createRequiredFolders = async () => {
	const folderPaths = [
		['models'],
		['migrations'],
		['__tests__'],
		['__tests__', 'models'],
		['__tests__', 'data'],
	];

	// Create the folder folder path
	for await (const folderPath of folderPaths) {
		const fullFolderPath = path.join(process.cwd(), ...folderPath);
		createFolderUnlessExists(fullFolderPath);
	}
};

const createModelFile = async (modelName) => {
	// generate the filename and file path
	// generate the body content to put in the file
	// write the file
};

const createMigrationFile = async (modelName) => {
	const tableName = pluralize(modelName.toLowerCase());
	// generate the filename and file path
	// generate the body content to put in the file
	// write the file
};

const createTestModelFile = async (modelName) => {
	// generate the filename and file path
	// generate the body content to put in the file
	// write the file
};

const createTestSeedDataFile = async (modelName) => {
	// generate the filename and file path
	// generate the body content to put in the file
	// write the file
};

const createRequiredFiles = async (modelName) => {
	await Promise.all([
		createModelFile(modelName),
		createMigrationFile(modelName),
		createTestModelFile(modelName),
		createTestSeedDataFile(modelName),
	]);
};

module.exports = {
	createRequiredFolders,
	createRequiredFiles,
};
