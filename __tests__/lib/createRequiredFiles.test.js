const { getTimestamp } = require('../../lib/createRequiredFiles');
const assert = require('assert');

Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
	value: function () {
		function pad2(n) {
			// always returns a string
			return (n < 10 ? '0' : '') + n;
		}

		return (
			this.getFullYear() +
			pad2(this.getMonth() + 1) +
			pad2(this.getDate()) +
			pad2(this.getHours()) +
			pad2(this.getMinutes()) +
			pad2(this.getSeconds())
		);
	},
});

describe('createRequiredFiles', () => {
	describe('#getTimestamp', () => {
		it('should return the timestamp identical to what Knex.js uses for migration filenames', async () => {
			const timestamp = getTimestamp();
			assert.equal(timestamp, new Date().YYYYMMDDHHMMSS());
		});
	});
	describe('#createModelFile', () => {
		it.todo('should create the model file for the model');
	});

	describe('#createMigrationFile', () => {
		it.todo('should create the migration file for the model table');
	});

	describe('#createTestModelFile', () => {
		it.todo('should create the test model file for the model');
	});

	describe('#createTestSeedDataFile', () => {
		it.todo('should create the test data seed file for the model');
	});

	describe('#createRequiredFiles', () => {
		it.todo('should create the required files for the model');
		it.todo(
			'should support creating those files in a custom root directory'
		);
		it.todo(
			'should support creating the test files in a custom test folder'
		);
		it.todo('should return a list of the files created');
	});
});
