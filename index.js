#!/usr/bin/env node
// if(process.env.NODE_ENV == "development") {
  require('dotenv').config();
// }
const path = require('path');
const getTables = require('./lib/db/getTables');
const init = require('./lib/init');
const build = require('./lib/build');

const argv = require('yargs')
.command({
  command: 'init',
  desc: 'Initialize the build process by creating config.js in db/',
  handler: (argv) => {
    getTables().then((tables) => {
      init(tables);
    });
  }
}).command({
  command: 'build',
  desc: 'Build the getter and setter functions in db/',
  handler: (argv) => {
    const build_obj = require(path.resolve('./db/config.js'));
    build(build_obj);
  }
}).demandCommand(1, "You need mention either 'init' or 'build'")
.help()
.argv;
