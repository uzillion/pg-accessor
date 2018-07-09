#!/usr/bin/env node
// if(process.env.NODE_ENV == "development") {
  require('dotenv').config();
// }
const path = require('path');
const getTables = require('./lib/db/getTables');
const init = require('./lib/init');
const build = require('./lib/build');
const fs = require('fs');

const argv = require('yargs')
.command({
  command: 'init',
  desc: 'Initialize the build process by creating config.js in db/',
  handler: (argv) => {
    if(!fs.existsSync(path.resolve('./db'))) {
      fs.mkdirSync(path.resolve('./db'));
    }
    getTables().then((tables) => {
      init(tables);
    });
  }
}).command({
  command: 'build',
  desc: 'Build the getter and setter functions in db/',
  handler: (argv) => {
    if(fs.existsSync(path.resolve('./db/config.js'))) {
      const build_obj = require(path.resolve('./db/config.js'));
      build(build_obj);
    } else {
      console.log('You need to run "accessor init" before running build command');
      process.exit(1);
    }
  }
}).demandCommand(1, "You need mention either 'init' or 'build'")
.help()
.argv;
