import pluralize from "pluralize";
import to from "to-case";
import type { Attribute } from "../attributes.js";

const testSeedDataFileTemplate = (
	modelName: string,
	attributes: Attribute[] = [],
): string => {
	const variableName = pluralize(to.camel(modelName));

	const validAttributes =
		attributes.length === 0
			? "{}"
			: `{\n${attributes
					.map(
						(attribute) =>
							`\t\t${attribute.name}: ${JSON.stringify(attribute.sampleValue)},\n`,
					)
					.join("")}\t}`;

	return `// Dependencies

const ${variableName} = {
	valid: ${validAttributes},
};

module.exports = ${variableName};
`;
};

export default testSeedDataFileTemplate;
