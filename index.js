#!/usr/bin/env node
const path = require('path');
const init = require('./lib/init');
const build = require('./lib/build');
const fs = require('fs');
global.dest = './db'; 
const argv = require('yargs')
.command({
  command: 'init',
  desc: 'Initialize the build process by creating config.js in db/',
  handler: (argv) => {
    const getTables = require('./lib/db/getTables');
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
      console.error('\n\033[\033[1;31mERROR:\033[00m Cannot find config.js');
      console.log('\nTry running "accessor init" to generate a config.js file.');
      process.exit(1);
    }
  }
}).demandCommand(1, "You need to mention either 'init' or 'build'")
.help()
.argv;
