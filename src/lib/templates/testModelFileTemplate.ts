import path from 'node:path';
import to from 'to-case';

const testModelFileTemplate = (modelName: string): string => {
	const modelFileName = to.pascal(modelName);
	const modelFilePath = path.join('..', '..', 'models', modelFileName);

	return `// Dependencies
const ${modelFileName} = require("${modelFilePath}");

describe("${modelFileName}", () => {
	${modelName};
	it("should do something");
});
`;
};

export default testModelFileTemplate;
