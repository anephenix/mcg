// Dependencies
const path = require('path');
const { stat, mkdir } = require('./helpers');

// Creates a folder unless it exists already
const createFolderUnlessExists = async (folderPath) => {
	try {
		const checkedFolder = await stat(folderPath);
		if (checkedFolder.isDirectory()) return;
	} catch {
		await mkdir(folderPath);
	}
};

/*
	Creates a set of folders that need to exist for files
	to be inserted into
*/
const createRequiredFolders = async ({ rootDir, testFolder }) => {
	const folderPaths = [
		['models'],
		['migrations'],
		[testFolder],
		[testFolder, 'models'],
		[testFolder, 'data'],
	];

	// Create the folder folder path
	for await (const folderPath of folderPaths) {
		const fullFolderPath = path.join(rootDir, ...folderPath);
		await createFolderUnlessExists(fullFolderPath);
	}
};

module.exports = { createRequiredFolders, createFolderUnlessExists };
