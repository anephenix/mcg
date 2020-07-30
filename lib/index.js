const pluralize = require('pluralize');
const to = require('to-case');
const path = require('path');
const { stat, mkdir, writeFile } = require('./promisifiedFunctions');
const modelFileTemplate = require('./templates/modelFileTemplate');
const migrationFileTemplate = require('./templates/migrationFileTemplate');
const testModelFileTemplate = require('./templates/testModelFileTemplate');
const testSeedDataFileTemplate = require('./templates/testSeedDataFileTemplate');
const rootDir = process.cwd();

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
		const fullFolderPath = path.join(rootDir, ...folderPath);
		createFolderUnlessExists(fullFolderPath);
	}
};

const createModelFile = async (modelName) => {
	const fileName = to.pascal(modelName) + '.js'; // Post.js (make sure that it is titleized and singular)
	const filePath = path.join(rootDir, 'models', fileName);
	const fileContent = modelFileTemplate(to.pascal(modelName));
	await writeFile(filePath, fileContent, { encoding: 'utf8' });
};

const zeroPad = (number) => {
	number < 10 ? `0${number}` : number;
};

const getTimestamp = () => {
	const date = new Date();
	const year = date.getFullYear();
	const month = zeroPad(date.getMonth() + 1);
	const day = zeroPad(date.getDate());
	const hours = zeroPad(date.getHours());
	const minutes = zeroPad(date.getMinutes());
	const seconds = zeroPad(date.getSeconds());
	return [year, month, day, hours, minutes, seconds].join('');
};

const createMigrationFile = async (modelName) => {
	const tableName = pluralize(to.slug(modelName));
	const fileName = `${getTimestamp()}_create_${tableName}_table.js`;
	const filePath = path.join(rootDir, 'migrations', fileName);
	const fileContent = migrationFileTemplate(tableName);
	await writeFile(filePath, fileContent, { encoding: 'utf8' });
};

const createTestModelFile = async (modelName) => {
	const fileName = to.pascal(modelName) + '.test.js';
	const filePath = path.join(rootDir, '__tests__', 'models', fileName);
	const fileContent = testModelFileTemplate(modelName);
	await writeFile(filePath, fileContent, { encoding: 'utf8' });
};

const createTestSeedDataFile = async (modelName) => {
	const fileName = 'seed' + to.pascal(modelName) + '.js';
	const filePath = path.join(rootDir, '__tests__', 'data', fileName);
	const fileContent = testSeedDataFileTemplate(modelName);
	await writeFile(filePath, fileContent, { encoding: 'utf8' });
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
