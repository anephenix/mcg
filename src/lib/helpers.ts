import { exec as execType } from "node:child_process";
import {
	mkdir as mkdirType,
	readFile as readFileType,
	rmdir as rmdirType,
	rm as rmType,
	stat as statType,
	unlink as unlinkType,
	writeFile as writeFileType,
} from "node:fs";
import { pipeline as streamPipelineType } from "node:stream";
import { promisify } from "node:util";

// Promisified functions
export const exec = promisify(execType);
export const readFile = promisify(readFileType);
export const writeFile = promisify(writeFileType);
export const mkdir = promisify(mkdirType);
export const unlink = promisify(unlinkType);
export const rm = promisify(rmType);
export const rmdir = promisify(rmdirType);
export const stat = promisify(statType);
export const streamPipeline = promisify(streamPipelineType);
