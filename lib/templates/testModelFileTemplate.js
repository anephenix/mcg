const to = require('to-case');
const path = require('path');

module.exports = (modelName) => {
	const modelFileName = to.pascal(modelName);
	const modelFilePath = path.join('..', '..', 'models', modelFileName);

	return `// Dependencies
const ${modelFileName} = require('${modelFilePath}');

describe('${modelFileName}', () => {
	${modelName};
	it.todo('should do something');
});
`;
};
