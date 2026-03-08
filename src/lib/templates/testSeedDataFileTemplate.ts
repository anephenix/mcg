import pluralize from 'pluralize';
import to from 'to-case';

const testSeedDataFileTemplate = (modelName: string): string => {
	const variableName = pluralize(to.camel(modelName));

	return `// Dependencies

const ${variableName} = {
	valid: {},
};

module.exports = ${variableName};
`;
};

export default testSeedDataFileTemplate;
