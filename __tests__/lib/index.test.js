const assert = require('assert');
const lib = require('../../lib');
describe('lib', () => {
	it('should export an object with the functions needed to generate the folders and files', () => {
		assert(typeof lib === 'object');
		assert(typeof lib.createRequiredFiles === 'function');
		assert(typeof lib.createRequiredFolders === 'function');
	});
});
