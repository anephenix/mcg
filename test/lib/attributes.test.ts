import { describe, expect, it } from "vitest";
import { parseAttributes } from "../../src/lib/attributes";

describe("parseAttributes", () => {
	it("should return an empty array when no attributes are passed", () => {
		expect(parseAttributes()).toEqual([]);
		expect(parseAttributes([])).toEqual([]);
	});

	it("should parse name:type pairs into attribute metadata", () => {
		const attributes = parseAttributes([
			"title:string",
			"description:text",
			"published:boolean",
		]);
		expect(attributes).toEqual([
			{
				name: "title",
				type: "string",
				knexMethod: "string",
				jsonSchemaType: "string",
				sampleValue: "Sample string",
			},
			{
				name: "description",
				type: "text",
				knexMethod: "text",
				jsonSchemaType: "string",
				sampleValue: "Sample text",
			},
			{
				name: "published",
				type: "boolean",
				knexMethod: "boolean",
				jsonSchemaType: "boolean",
				sampleValue: true,
			},
		]);
	});

	it("should include a jsonSchemaFormat for types that have one", () => {
		const attributes = parseAttributes(["publishedAt:datetime"]);
		expect(attributes[0].jsonSchemaFormat).toBe("date-time");
	});

	it("should throw an error when an attribute is not in the name:type format", () => {
		expect(() => parseAttributes(["title"])).toThrow(
			'Invalid attribute "title". Attributes must be in the format name:type (e.g. title:string).',
		);
	});

	it("should throw an error when an attribute type is not supported", () => {
		expect(() => parseAttributes(["title:unknownType"])).toThrow(
			/Unsupported attribute type "unknownType" for attribute "title"/,
		);
	});
});
