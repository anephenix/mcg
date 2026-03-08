import { describe, expect, it } from "vitest";
import * as templates from "../../../src/lib/templates";

describe("templates", () => {
	it("should return an object with templates for the different files", () => {
		expect(typeof templates).toBe("object");
		expect(typeof templates.modelFileTemplate).toBe("function");
		expect(typeof templates.migrationFileTemplate).toBe("function");
		expect(typeof templates.testModelFileTemplate).toBe("function");
		expect(typeof templates.testSeedDataFileTemplate).toBe("function");
	});
});

// Next step, use vitest in place of mocha and nyc.
