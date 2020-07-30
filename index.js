const { createRequiredFolders, createRequiredFiles } = require('./lib');

const main = async (modelName) => {
	const rootDir = process.cwd();
	await createRequiredFolders({ rootDir });
	await createRequiredFiles({ modelName, rootDir });
};

module.exports = main;
