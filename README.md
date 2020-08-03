# Model Component Generator

[![npm version](https://badge.fury.io/js/%40anephenix%2Fmcg.svg)](https://badge.fury.io/js/%40anephenix%2Fmcg) [![CircleCI](https://circleci.com/gh/anephenix/mcg.svg?style=shield)](https://circleci.com/gh/anephenix/mcg)
[![Coverage Status](https://coveralls.io/repos/github/anephenix/mcg/badge.svg?branch=master&version=1)](https://coveralls.io/github/anephenix/mcg?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/3fabf6075ba1859d0b0e/maintainability)](https://codeclimate.com/github/anephenix/mcg/maintainability)

A Node.js library and CLI for generating Objection.js Models and their supporting files. It helps to save time creating Models and their migrations, so that you can focus on implementing the business logic for your Node.js server-side project.

### Features

-   Creates an Objection.js model file via the commandline
-   Creates the model's knex.js migration file for the model's database table
-   Create a test model file in the **tests** folder by default
-   Create a test seed data file in the **tests**/data folder by default

### Dependencies

-   [Node.js](https://nodejs.org)
-   [Objection.js](https://vincit.github.io/objection.js/)
-   [Knex.js](http://knexjs.org)

### Install

```shell
npm i @anephenix/mcg
```

### Usage

You can use MCG via the command line:

```shell
npx mcg Post
```

This will do the following:

-   Create a folder called models, unless it already exists
-   Create a model file called Post.js in the models folder
-   Create a folder called migrations, unless it already exists
-   Generate a migration file to create the posts table with the created_at and updated_at timestamp fields.

You can pass the following optional arguments:

--testFolder - specify a custom folder name to put the test model file and seed data file in (e.g. test, spec)
--mainDir    - specify a custom folder path to generate all of the files in, in case your app's code is not in the current working directory

There is also the option of setting these optional arguments in a mcg.config.js file that looks like this:

```javascript
module.exports = {
	testFolder: 'spec',
	mainDir: 'app'
};
```

You can also use MCG programmatically, like this:

```javascript
const mcg = require('@anephenix/mcg');
(async () => {
	await mcg('Post');
})();
```

The mainDir and testFolder are optional 2nd and 3rd arguments to that command:

```javascript
const path = require('path');
const mcg = require('@anephenix/mcg');
(async () => {
	const mainDir = path.join(process.cwd(), 'app');
	const testFolder = 'spec';
	await mcg('Post', mainDir, testFolder);
})();
```

### License and Credits

&copy;2020 Anephenix OÜ. MCG is licensed under the MIT license.
