# Model Component Generator

[![npm version](https://badge.fury.io/js/%40anephenix%2Fmcg.svg)](https://badge.fury.io/js/%40anephenix%2Fmcg) [![CircleCI](https://circleci.com/gh/anephenix/mcg.svg?style=shield)](https://circleci.com/gh/anephenix/mcg)
[![Coverage Status](https://coveralls.io/repos/github/anephenix/mcg/badge.svg?branch=master)](https://coveralls.io/github/anephenix/mcg?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/3fabf6075ba1859d0b0e/maintainability)](https://codeclimate.com/github/anephenix/mcg/maintainability)

A Node.js CLI and library for generating Models using Objection.js

### Features

-   Create Objection.js models
-   Generate the test seed data file
-   Generate the test file
-   Generate the migration file for the model's database table

### Dependencies

-   [Node.js](https://nodejs.org)

### Install

```shell
npm i @anephenix/mcg
```

### Usage

You can use MCG via the command line:

```shell
npx mcg Post title:string description:text published:boolean --timestamps
```

This will do the following:

-   Create a folder called models, unless it already exists
-   Create a model file called Post.js in the models folder
-   Create a folder called migrations, unless it already exists
-   Generate a migration file to create the posts table with the fileds title, description, and published, as well as created_at and updated_at timestamps.

You can also use MCG programmatically, like this:

```javascript
const mcg = require('@anephenix/mcg');
(async () => {
	await mcg('Post');
})();
```

### License and Credits

&copy;2020 Anephenix OÜ. MCG is licensed under the MIT license.
