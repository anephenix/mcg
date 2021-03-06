const to = require('to-case');
const path = require('path');
const { writeFile } = require('./helpers');

const {
	modelFileTemplate,
	migrationFileTemplate,
	testModelFileTemplate,
	testSeedDataFileTemplate,
} = require('./templates');

const zeroPad = (number) => {
	return number < 10 ? `0${number}` : number;
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

const createModelFile = async ({ modelName, rootDir, tableName }) => {
	const fileName = to.pascal(modelName) + '.js';
	const filePath = path.join(rootDir, 'models', fileName);
	const fileContent = modelFileTemplate({
		modelName: to.pascal(modelName),
		tableName,
	});
	await writeFile(filePath, fileContent, { encoding: 'utf8' });
	return filePath;
};

const createMigrationFile = async ({ tableName, rootDir }) => {
	const fileName = `${getTimestamp()}_create_${tableName}_table.js`;
	const filePath = path.join(rootDir, 'migrations', fileName);
	const fileContent = migrationFileTemplate(tableName);
	await writeFile(filePath, fileContent, { encoding: 'utf8' });
	return filePath;
};

const createTestModelFile = async ({ modelName, rootDir, testFolder }) => {
	const fileName = to.pascal(modelName) + '.test.js';
	const filePath = path.join(rootDir, testFolder, 'models', fileName);
	const fileContent = testModelFileTemplate(modelName);
	await writeFile(filePath, fileContent, { encoding: 'utf8' });
	return filePath;
};

const createTestSeedDataFile = async ({ modelName, rootDir, testFolder }) => {
	const fileName = to.camel(modelName) + 'Data.test.js';
	const filePath = path.join(rootDir, testFolder, 'data', fileName);
	const fileContent = testSeedDataFileTemplate(modelName);
	await writeFile(filePath, fileContent, { encoding: 'utf8' });
	return filePath;
};

const createRequiredFiles = async ({
	modelName,
	rootDir,
	testFolder,
	tableName,
}) => {
	const files = await Promise.all([
		createModelFile({ modelName, rootDir, tableName }),
		createMigrationFile({ tableName, rootDir }),
		createTestModelFile({ modelName, rootDir, testFolder }),
		createTestSeedDataFile({ modelName, rootDir, testFolder }),
	]);
	return files;
};

module.exports = {
	createModelFile,
	createMigrationFile,
	createTestModelFile,
	createTestSeedDataFile,
	createRequiredFiles,
	getTimestamp,
};
