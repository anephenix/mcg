import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { parseAttributes } from "../../../src/lib/attributes";
import { readFile } from "../../../src/lib/helpers";
import migrationFileTemplate from "../../../src/lib/templates/migrationFileTemplate";

const migrationFileExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"migrationFileExample.test.js",
);

const migrationFileWithAttributesExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"migrationFileWithAttributesExample.test.js",
);

describe("migrationFileTemplate", () => {
	it("should return the file content for the model table migration", async () => {
		const generatedContent = migrationFileTemplate("posts");
		const exampleContent = await readFile(migrationFileExampleFilePath, {
			encoding: "utf8",
		});
		expect(generatedContent).toBe(exampleContent);
	});

	it("should include table columns for any attributes passed", async () => {
		const attributes = parseAttributes([
			"title:string",
			"description:text",
			"published:boolean",
		]);
		const generatedContent = migrationFileTemplate("posts", attributes);
		const exampleContent = await readFile(
			migrationFileWithAttributesExampleFilePath,
			{ encoding: "utf8" },
		);
		expect(generatedContent).toBe(exampleContent);
	});
});
