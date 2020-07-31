const template = (tableName) => {
	return `// Migration for the ${tableName} table
const tableName = '${tableName}';

exports.up = (knex) => {
	// Create the ${tableName} table
	return knex.schema.createTableIfNotExists(tableName, (table) => {
		table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
		table.timestamps(true, true);
	});
};

exports.down = (knex) => {
	// Drop the ${tableName} table
	return knex.schema.dropTableIfExists(tableName);
};`;
};

module.exports = template;
