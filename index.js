#!/usr/bin/env node
// if(process.env.NODE_ENV == "development") {
  require('dotenv').config();
// }
const path = require('path');
const getTables = require('./lib/db/getTables');
const init = require('./lib/init');
const argv = require('yargs').argv;
const build = require('./lib/build');

switch(argv._[0]) {
  case "init":
    getTables().then((tables) => {
      init(tables);
    });
    break;
  case "build":
    // console.log(path.resolve('./db'));
    const build_obj = require(path.resolve('./db/config.js'));
    build(build_obj);
    break;

}


