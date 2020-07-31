const { createRequiredFolders, createRequiredFiles } = require('./lib');

const main = async (modelName, rootDir = process.cwd()) => {
	await createRequiredFolders({ rootDir });
	await createRequiredFiles({ modelName, rootDir });
};

module.exports = main;
