import to from 'to-case';
import path from 'path';

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
