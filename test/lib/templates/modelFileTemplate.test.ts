import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { readFile } from "../../../src/lib/helpers";
import modelFileTemplate from "../../../src/lib/templates/modelFileTemplate";

const modelFileExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"modelFileExample.test.js",
);

describe("modelFileTemplate", () => {
	it("should return the file content for the objection.js model", async () => {
		const generatedContent = modelFileTemplate({
			modelName: "Post",
			tableName: "posts",
		});
		const exampleContent = await readFile(modelFileExampleFilePath, {
			encoding: "utf8",
		});
		expect(generatedContent).toBe(exampleContent);
	});
});
