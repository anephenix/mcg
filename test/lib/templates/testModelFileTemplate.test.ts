import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { readFile } from "../../../src/lib/helpers";
import testModelFileTemplate from "../../../src/lib/templates/testModelFileTemplate";

const testModelFileExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"testModelFileExample.test.js",
);

describe("testModelFileTemplate", () => {
	it("should return the file content for the test model file", async () => {
		const generatedContent = testModelFileTemplate("Post");
		const exampleContent = await readFile(testModelFileExampleFilePath, {
			encoding: "utf8",
		});
		expect(generatedContent).toBe(exampleContent);
	});
});
