import { createRequiredFolders, createRequiredFiles } from './src/lib';
import { describe, expect, it } from 'vitest';

describe('lib', () => {
	it('should export an object with the functions needed to generate the folders and files', () => {
		expect(typeof createRequiredFiles).toBe('function');
		expect(typeof createRequiredFolders).toBe('function');
	});
});
