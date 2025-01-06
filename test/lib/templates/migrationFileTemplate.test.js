const path = require('path');
const migrationFileExampleFilePath = path.join(
	process.cwd(),
	'test',
	'data',
	'migrationFileExample.test.js'
);
const migrationFileTemplate = require('../../../lib/templates/migrationFileTemplate');
const { readFile } = require('../../../lib/helpers');
const assert = require('assert');

describe('migrationFileTemplate', () => {
	it('should return the file content for the model table migration', async () => {
		const generatedContent = migrationFileTemplate('posts');
		const exampleContent = await readFile(migrationFileExampleFilePath, {
			encoding: 'utf8',
		});
		assert.equal(generatedContent, exampleContent);
	});
});
