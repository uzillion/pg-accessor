#!/usr/bin/env node
// if(process.env.NODE_ENV == "development") {
  require('dotenv').config();
// }
const path = require('path');
const getTables = require('./lib/db/getTables');
const genConfig = require('./lib/build_config');
const argv = require('yargs').argv;
const genFiles = require('./lib/genFiles');

switch(argv._[0]) {
  case "init":
    getTables().then((tables) => {
      genConfig(tables);
    });
    break;
  case "build":
    // console.log(path.resolve('./db'));
    const build_obj = require(path.resolve('./db/config.js'));
    genFiles(build_obj);
    break;

}


