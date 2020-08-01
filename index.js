const { createRequiredFolders, createRequiredFiles } = require('./lib');

const main = async (modelName, rootDir = process.cwd(), testFolder = '__tests__') => {
	await createRequiredFolders({ rootDir, testFolder });
	return await createRequiredFiles({ modelName, rootDir, testFolder });
};

module.exports = main;
