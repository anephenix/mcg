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
const delay = (duration) =>
	new Promise((resolve) => setTimeout(resolve, duration));

const delayUntil = (condition, timeout) => {
	return new Promise((resolve, reject) => {
		let interval;
		const timeAtStart = new Date().getTime();
		interval = setInterval(async () => {
			let result;
			if (condition() instanceof Promise) {
				result = await condition();
			} else {
				result = condition();
			}
			if (result) {
				resolve(true);
				clearInterval(interval);
			} else {
				const currentTime = new Date().getTime();
				if (timeout && currentTime - timeAtStart > timeout) {
					reject(
						new Error(
							'Condition did not resolve before the timeout'
						)
					);
					clearInterval(interval);
				}
			}
		});
	});
};


module.exports = {
	exec,
	readFile,
	writeFile,
	mkdir,
	unlink,
	rmdir,
	stat,
	streamPipeline,
	delay,
	delayUntil
};
