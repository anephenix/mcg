const path = require('path');
const modelFileExampleFilePath = path.join(
	process.cwd(),
	'__tests__',
	'data',
	'modelFileExample.test.js'
);
const modelFileTemplate = require('../../../lib/templates/modelFileTemplate');
const { readFile } = require('../../../lib/helpers');
const assert = require('assert');

describe('modelFileTemplate', () => {
	it('should return the file content for the objection.js model', async () => {
		const generatedContent = modelFileTemplate('Post');
		const exampleContent = await readFile(modelFileExampleFilePath, {
			encoding: 'utf8',
		});
		assert.equal(generatedContent, exampleContent);
	});
});
