const path = require('path');
const testSeedDataFileExampleFilePath = path.join(
	process.cwd(),
	'test',
	'data',
	'testSeedDataFileExample.test.js'
);
const testSeedDataFileTemplate = require('../../../lib/templates/testSeedDataFileTemplate');
const { readFile } = require('../../../lib/helpers');
const assert = require('assert');

describe('testSeedDataFileTemplate', () => {
	it('should return the file content for the test seed data file for the model', async () => {
		const generatedContent = testSeedDataFileTemplate('Post');
		const exampleContent = await readFile(testSeedDataFileExampleFilePath, {
			encoding: 'utf8',
		});
		assert.equal(generatedContent, exampleContent);
	});
});
