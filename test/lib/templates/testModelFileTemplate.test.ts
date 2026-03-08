import * as path from 'path';
import testModelFileTemplate from '../../../src/lib/templates/testModelFileTemplate';
import { readFile } from '../../../src/lib/helpers';
import { describe, expect, it } from 'vitest';

const testModelFileExampleFilePath = path.join(
	process.cwd(),
	'test',
	'data',
	'testModelFileExample.test.js'
);

describe('testModelFileTemplate', () => {
	it('should return the file content for the test model file', async () => {
		const generatedContent = testModelFileTemplate('Post');
		const exampleContent = await readFile(testModelFileExampleFilePath, {
			encoding: 'utf8',
		});
		expect(generatedContent).toBe(exampleContent);
	});
});
