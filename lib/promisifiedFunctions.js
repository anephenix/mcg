// Dependencies
const { promisify } = require('util');
const stream = require('stream');
const childProcess = require('child_process');
const fs = require('fs');

const exec = promisify(childProcess.exec);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const streamPipeline = promisify(stream.pipeline);
const stat = promisify(fs.stat);

module.exports = {
	exec,
	readFile,
	writeFile,
	mkdir,
	unlink,
	rmdir,
	stat,
	streamPipeline,
};
