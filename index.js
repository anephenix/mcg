const { createRequiredFolders, createRequiredFiles } = require('./lib');

const main = async (modelName, rootDir = process.cwd()) => {
	await createRequiredFolders({ rootDir });
	return await createRequiredFiles({ modelName, rootDir });
};

module.exports = main;
