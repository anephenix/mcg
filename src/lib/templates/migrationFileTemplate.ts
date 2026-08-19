import type { Attribute } from "../attributes.js";

const migrationFileTemplate = (
	tableName: string,
	attributes: Attribute[] = [],
): string => {
	const attributeLines = attributes
		.map(
			(attribute) =>
				`\t\ttable.${attribute.knexMethod}("${attribute.name}");\n`,
		)
		.join("");

	return `// Migration for the ${tableName} table
const tableName = "${tableName}";

exports.up = (knex) => {
	// Create the ${tableName} table
	return knex.schema.createTableIfNotExists(tableName, (table) => {
		table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
${attributeLines}		table.timestamps(true, true);
	});
};

exports.down = (knex) => {
	// Drop the ${tableName} table
	return knex.schema.dropTableIfExists(tableName);
};
`;
};

export default migrationFileTemplate;
