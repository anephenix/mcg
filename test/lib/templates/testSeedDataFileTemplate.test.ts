import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { parseAttributes } from "../../../src/lib/attributes";
import { readFile } from "../../../src/lib/helpers";
import testSeedDataFileTemplate from "../../../src/lib/templates/testSeedDataFileTemplate";

const testSeedDataFileExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"testSeedDataFileExample.test.js",
);

const testSeedDataFileWithAttributesExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"testSeedDataFileWithAttributesExample.test.js",
);

describe("testSeedDataFileTemplate", () => {
	it("should return the file content for the test seed data file for the model", async () => {
		const generatedContent = testSeedDataFileTemplate("Post");
		const exampleContent = await readFile(testSeedDataFileExampleFilePath, {
			encoding: "utf8",
		});
		expect(generatedContent).toBe(exampleContent);
	});

	it("should include sample values for any attributes passed", async () => {
		const attributes = parseAttributes([
			"title:string",
			"description:text",
			"published:boolean",
		]);
		const generatedContent = testSeedDataFileTemplate("Post", attributes);
		const exampleContent = await readFile(
			testSeedDataFileWithAttributesExampleFilePath,
			{ encoding: "utf8" },
		);
		expect(generatedContent).toBe(exampleContent);
	});
});
