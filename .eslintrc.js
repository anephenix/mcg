module.exports = {
	env: {
		es6: true,
		node: true,
		mocha: true,
	},
	extends: 'eslint:recommended',
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2017,
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		semi: ['error', 'always'],
	},
};
