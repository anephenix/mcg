const path = require('path');
const testModelFileExampleFilePath = path.join(
	process.cwd(),
	'__tests__',
	'data',
	'testModelFileExample.test.js'
);
const testModelFileTemplate = require('../../../lib/templates/testModelFileTemplate');
const { readFile } = require('../../../lib/helpers');
const assert = require('assert');

describe('testModelFileTemplate', () => {
	it('should return the file content for the test model file', async () => {
		const generatedContent = testModelFileTemplate('Post');
		const exampleContent = await readFile(testModelFileExampleFilePath, {
			encoding: 'utf8',
		});
		assert.equal(generatedContent, exampleContent);
	});
});
