const pluralize = require('pluralize');
const to = require('to-case');

module.exports = (modelName) => {
	const variableName = 'seed' + pluralize(to.pascal(modelName));

	return `// Dependencies

const ${variableName} = {
	valid: {},
};

module.exports = ${variableName};`;
};
