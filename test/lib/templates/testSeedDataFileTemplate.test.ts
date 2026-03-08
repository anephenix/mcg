import * as path from 'path';
import testSeedDataFileTemplate from '../../../src/lib/templates/testSeedDataFileTemplate';
import { readFile } from '../../../src/lib/helpers';
import { describe, expect, it } from 'vitest';

const testSeedDataFileExampleFilePath = path.join(
	process.cwd(),
	'test',
	'data',
	'testSeedDataFileExample.test.js'
);

describe('testSeedDataFileTemplate', () => {
	it('should return the file content for the test seed data file for the model', async () => {
		const generatedContent = testSeedDataFileTemplate('Post');
		const exampleContent = await readFile(testSeedDataFileExampleFilePath, {
			encoding: 'utf8',
		});
		expect(generatedContent).toBe(exampleContent);
	});
});
