#!/usr/bin/env node
// if(process.env.NODE_ENV == "development") {
//   require('dotenv').config();
// }
const path = require('path');
const init = require('./lib/init');
const build = require('./lib/build');
const getTables = require('./lib/db/getTables');
const fs = require('fs');
global.dest = './db'; 
const argv = require('yargs')
.command({
  command: 'init',
  desc: 'Initialize the build process by creating config.js in db/',
  handler: (argv) => {

    if(!fs.existsSync(path.resolve(dest))) {
      fs.mkdirSync(path.resolve(dest));
    }
    getTables().then((tables) => {
      init(tables);
    });
  }
}).command({
  command: 'build',
  desc: 'Build the getter and setter functions in db/',
  handler: (argv) => {
    if(fs.existsSync(path.resolve(`${dest}/config.js`))) {
      const build_obj = require(path.resolve(`${dest}/config.js`));
      build(build_obj);
    } else {
      console.log('ERROR: You need to run "accessor init" before running build command');
      process.exit(1);
    }
  }
}).demandCommand(1, "You need mention either 'init' or 'build'")
.help()
.argv;
