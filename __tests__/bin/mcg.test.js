const assert = require('assert');
const path = require('path');
const {
	exec,
	mkdir,
	rmdir,
	stat,
	unlink,
	readFile,
	writeFile,
} = require('../../lib/helpers');
const { getTimestamp } = require('../../lib/createRequiredFiles');

const compareExpectedAndActualFiles = async ({
	rootDir,
	expectedFilePathFolders,
	exampleFileName,
}) => {
	const expectedFilePath = path.join(rootDir, ...expectedFilePathFolders);
	const exampleFilePath = path.join(
		process.cwd(),
		'__tests__',
		'data',
		exampleFileName
	);
	const fileCheck = await stat(expectedFilePath);
	assert(fileCheck.isFile());
	const fileContent = await readFile(expectedFilePath, {
		encoding: 'utf8',
	});
	const expectedFileContent = await readFile(exampleFilePath, {
		encoding: 'utf8',
	});
	assert.equal(fileContent, expectedFileContent);
};

describe('mcg', () => {
	it('should generate the files and folders for a new model', async () => {
		const command = './bin/mcg Post';
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			'__tests__/models/Post.test.js',
			'__tests__/data/postData.test.js',
			'models/Post.js',
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(process.cwd(), fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(process.cwd(), 'models'), { recursive: true });
		await rmdir(path.join(process.cwd(), 'migrations'), {
			recursive: true,
		});
		await rmdir(path.join(process.cwd(), '__tests__', 'models'), {
			recursive: true,
		});
	});

	it('should generate the test files in a custom folder, if a custom test folder is passed', async () => {
		const command = './bin/mcg Post --testFolder test';
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			'test/models/Post.test.js',
			'test/data/postData.test.js',
			'models/Post.js',
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(process.cwd(), fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(process.cwd(), 'models'), { recursive: true });
		await rmdir(path.join(process.cwd(), 'migrations'), {
			recursive: true,
		});
		await rmdir(path.join(process.cwd(), 'test'), {
			recursive: true,
		});
	});

	it('should generate the files in a custom main directory, if a custom main directory is passed', async () => {
		const mainDir = path.join(process.cwd(), 'sixthApp');
		await mkdir(mainDir);
		const command = `./bin/mcg Post --mainDir ${mainDir}`;
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			'__tests__/models/Post.test.js',
			'__tests__/data/postData.test.js',
			'models/Post.js',
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(mainDir, fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(mainDir), { recursive: true });
	});

	it('should read any custom testDir and mainDir settings from a config file, if a config file is present', async () => {
		const configFilePath = path.join(process.cwd(), 'mcg.config.js');
		const configFileData = `module.exports = { testFolder: 'spec' };`;
		await writeFile(configFilePath, configFileData);
		const command = './bin/mcg Post';
		const { stdout } = await exec(command);
		const timestamp = getTimestamp();
		const filesToCheck = [
			'spec/models/Post.test.js',
			'spec/data/postData.test.js',
			'models/Post.js',
			`migrations/${timestamp}_create_posts_table.js`,
		];
		for await (const fileToCheck of filesToCheck) {
			const filePath = path.join(process.cwd(), fileToCheck);
			const fileCheck = await stat(filePath);
			assert(fileCheck.isFile());
			assert(stdout.match(filePath) !== null);
			await unlink(filePath);
		}
		await rmdir(path.join(process.cwd(), 'models'), { recursive: true });
		await rmdir(path.join(process.cwd(), 'migrations'), {
			recursive: true,
		});
		await rmdir(path.join(process.cwd(), 'spec'), {
			recursive: true,
		});
		await unlink(configFilePath);
	});

	describe('custom tableName', () => {
		it('should allow the user to specify a custom table name for the model', async () => {
			const mainDir = path.join(process.cwd(), 'seventhApp');
			await mkdir(mainDir);
			const tableName = 'blog_posts';
			const command = `./bin/mcg Post --mainDir ${mainDir} --tableName ${tableName}`;
			const { stdout } = await exec(command);
			const timestamp = getTimestamp();
			const filesToCheck = [
				'models/Post.js',
				`migrations/${timestamp}_create_blog_posts_table.js`,
			];
			for await (const fileToCheck of filesToCheck) {
				const filePath = path.join(mainDir, fileToCheck);
				const fileCheck = await stat(filePath);
				assert(fileCheck.isFile());
				assert(stdout.match(filePath) !== null);
				if (fileToCheck === 'models/Post.js') {
					await compareExpectedAndActualFiles({
						rootDir: mainDir,
						expectedFilePathFolders: ['models', 'Post.js'],
						exampleFileName:
							'modelFileWithCustomTableNameExample.test.js',
					});
				}
				if (
					fileToCheck ===
					`migrations/${timestamp}_create_blog_posts_table.js`
				) {
					await compareExpectedAndActualFiles({
						rootDir: mainDir,
						expectedFilePathFolders: [
							'migrations',
							`${timestamp}_create_blog_posts_table.js`,
						],
						exampleFileName:
							'migrationFileWithCustomTableNameExample.test.js',
					});
				}

				await unlink(filePath);
			}
			await rmdir(path.join(mainDir), { recursive: true });
		});
	});

	describe('with attributes passed', () => {
		it.todo(
			'should generate a migration file that specifies what fields to put in the model table'
		);
		it.todo('should generate a model file with a jsonSchema property');
		it.todo('should define properties for the test seed data file');
		it.todo(
			'should define things to test in the model test file, such as validations'
		);
	});
	// Q - how to pass attributes in a way that can support jsonSchema, migration, test seed and test code?
	// T - I wonder if official jsonSchema JSON would be possible - would be a great way to assemble an API from a schema
});
