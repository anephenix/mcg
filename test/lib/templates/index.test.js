const assert = require('assert');
const templates = require('../../../lib/templates');

describe('templates', () => {
	it('should return an object with templates for the different files', () => {
		assert(typeof templates === 'object');
		assert(typeof templates.modelFileTemplate === 'function');
		assert(typeof templates.migrationFileTemplate === 'function');
		assert(typeof templates.testModelFileTemplate === 'function');
		assert(typeof templates.testSeedDataFileTemplate === 'function');
	});
});
