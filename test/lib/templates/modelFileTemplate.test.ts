import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { parseAttributes } from "../../../src/lib/attributes";
import { readFile } from "../../../src/lib/helpers";
import modelFileTemplate from "../../../src/lib/templates/modelFileTemplate";

const modelFileExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"modelFileExample.test.js",
);

const modelFileWithAttributesExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"modelFileWithAttributesExample.test.js",
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

	it("should include jsonSchema properties for any attributes passed", async () => {
		const attributes = parseAttributes([
			"title:string",
			"description:text",
			"published:boolean",
		]);
		const generatedContent = modelFileTemplate({
			modelName: "Post",
			tableName: "posts",
			attributes,
		});
		const exampleContent = await readFile(
			modelFileWithAttributesExampleFilePath,
			{ encoding: "utf8" },
		);
		expect(generatedContent).toBe(exampleContent);
	});
});
