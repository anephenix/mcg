import { describe, expect, it } from "vitest";
import { createRequiredFiles, createRequiredFolders } from "./src/lib";

describe("lib", () => {
	it("should export an object with the functions needed to generate the folders and files", () => {
		expect(typeof createRequiredFiles).toBe("function");
		expect(typeof createRequiredFolders).toBe("function");
	});
});
