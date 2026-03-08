import path from "node:path";
import { mkdir, stat } from "./helpers.js";

export const createFolderUnlessExists = async (
	folderPath: string,
): Promise<void> => {
	try {
		const checkedFolder = await stat(folderPath);
		// @ts-expect-error: checkedFolder may not have isDirectory if not properly typed
		if (checkedFolder.isDirectory?.()) return;
	} catch {
		await mkdir(folderPath);
	}
};

export interface CreateRequiredFoldersOptions {
	rootDir: string;
	testFolder: string;
}

/*
	Creates a set of folders that need to exist for files
	to be inserted into
*/
export const createRequiredFolders = async ({
	rootDir,
	testFolder,
}: CreateRequiredFoldersOptions): Promise<void> => {
	const folderPaths: string[][] = [
		["models"],
		["migrations"],
		[testFolder],
		[testFolder, "models"],
		[testFolder, "data"],
	];

	for await (const folderPath of folderPaths) {
		const fullFolderPath = path.join(rootDir, ...folderPath);
		await createFolderUnlessExists(fullFolderPath);
	}
};
