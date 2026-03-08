import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { readFile } from "../../../src/lib/helpers";
import migrationFileTemplate from "../../../src/lib/templates/migrationFileTemplate";

const migrationFileExampleFilePath = path.join(
	process.cwd(),
	"test",
	"data",
	"migrationFileExample.test.js",
);

describe("migrationFileTemplate", () => {
	it("should return the file content for the model table migration", async () => {
		const generatedContent = migrationFileTemplate("posts");
		const exampleContent = await readFile(migrationFileExampleFilePath, {
			encoding: "utf8",
		});
		expect(generatedContent).toBe(exampleContent);
	});
});
