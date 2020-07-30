const { createRequiredFolders, createRequiredFiles } = require('./lib');

const main = async (modelName) => {
	await createRequiredFolders();
	await createRequiredFiles(modelName);
};

module.exports = main;
