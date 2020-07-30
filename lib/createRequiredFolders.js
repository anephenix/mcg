// Dependencies
const path = require('path');
const { stat, mkdir } = require('./helpers');

// Creates a folder unless it exists already
const createFolderUnlessExists = async (folderPath) => {
	const checkedFolder = await stat(folderPath);
	if (checkedFolder.isDirectory()) return;
	await mkdir(folderPath);
};

/*
	Creates a set of folders that need to exist for files
	to be inserted into
*/
const createRequiredFolders = async ({ rootDir }) => {
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

module.exports = { createRequiredFolders, createFolderUnlessExists };
