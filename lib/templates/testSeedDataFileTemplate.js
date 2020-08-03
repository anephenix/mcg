const pluralize = require('pluralize');
const to = require('to-case');

module.exports = (modelName) => {
	const variableName = pluralize(to.camel(modelName));

	return `// Dependencies

const ${variableName} = {
	valid: {},
};

module.exports = ${variableName};
`;
};
