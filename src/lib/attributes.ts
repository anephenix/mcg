export interface Attribute {
	name: string;
	type: string;
	knexMethod: string;
	jsonSchemaType: string;
	jsonSchemaFormat?: string;
	sampleValue: unknown;
}

interface AttributeTypeDefinition {
	knexMethod: string;
	jsonSchemaType: string;
	jsonSchemaFormat?: string;
	sampleValue: unknown;
}

const attributeTypeDefinitions: Record<string, AttributeTypeDefinition> = {
	string: {
		knexMethod: "string",
		jsonSchemaType: "string",
		sampleValue: "Sample string",
	},
	text: {
		knexMethod: "text",
		jsonSchemaType: "string",
		sampleValue: "Sample text",
	},
	integer: {
		knexMethod: "integer",
		jsonSchemaType: "integer",
		sampleValue: 1,
	},
	float: {
		knexMethod: "float",
		jsonSchemaType: "number",
		sampleValue: 1.1,
	},
	boolean: {
		knexMethod: "boolean",
		jsonSchemaType: "boolean",
		sampleValue: true,
	},
	date: {
		knexMethod: "date",
		jsonSchemaType: "string",
		jsonSchemaFormat: "date",
		sampleValue: "2024-01-01",
	},
	datetime: {
		knexMethod: "datetime",
		jsonSchemaType: "string",
		jsonSchemaFormat: "date-time",
		sampleValue: "2024-01-01T00:00:00.000Z",
	},
	json: {
		knexMethod: "json",
		jsonSchemaType: "object",
		sampleValue: {},
	},
};

export const supportedAttributeTypes = Object.keys(attributeTypeDefinitions);

/*
	Parses attribute strings in the format "name:type" (e.g. "title:string")
	into the metadata needed to render them into the migration, model and
	test seed data file templates.
*/
export const parseAttributes = (rawAttributes: string[] = []): Attribute[] => {
	return rawAttributes.map((rawAttribute) => {
		const parts = rawAttribute.split(":");
		if (parts.length !== 2 || !parts[0] || !parts[1]) {
			throw new Error(
				`Invalid attribute "${rawAttribute}". Attributes must be in the format name:type (e.g. title:string).`,
			);
		}
		const [name, type] = parts;
		const definition = attributeTypeDefinitions[type];
		if (!definition) {
			throw new Error(
				`Unsupported attribute type "${type}" for attribute "${name}". Supported types are: ${supportedAttributeTypes.join(", ")}.`,
			);
		}
		return { name, type, ...definition };
	});
};
