import { promisify } from 'util';
import { pipeline as streamPipelineType } from 'stream';
import { exec as execType } from 'child_process';
import {
	readFile as readFileType,
	writeFile as writeFileType,
	mkdir as mkdirType,
	unlink as unlinkType,
	rm as rmType,
	stat as statType,
} from 'fs';

// Promisified functions
export const exec = promisify(execType);
export const readFile = promisify(readFileType);
export const writeFile = promisify(writeFileType);
export const mkdir = promisify(mkdirType);
export const unlink = promisify(unlinkType);
export const rm = promisify(rmType);
export const stat = promisify(statType);
export const streamPipeline = promisify(streamPipelineType);
