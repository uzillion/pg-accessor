#!/usr/bin/env node
const path = require('path');
const init = require('./lib/init');
const build = require('./lib/build');
const status = require('./lib/status');
const fs = require('fs');
global.dest = './db'; 
const program = require('commander');

program
  .version('1.1.0', '-v, --version')
  .usage('[option] <command>')
  .option('-o, --overwrite', 'Overwrite existing file(s)');

program
  .command('init')
  .description('Initialize the build process by creating config.js in db/')
  .action(() => {
    const getTables = require('./lib/db/getTables');
    if(!fs.existsSync(path.resolve(dest))) {
      fs.mkdirSync(path.resolve(dest));
    }
    getTables().then((tables) => {
      init(tables, program.overwrite);
    });
  });

program
  .command('build')
  .description('Build the getter and setter functions in db/')
  .action(() => {
    if(fs.existsSync(path.resolve(`${dest}/config.js`))) {
      const build_obj = require(path.resolve(`${dest}/config.js`));
      build(build_obj, program.overwrite);
    } else {
      console.error('\n\033[\033[1;31mERROR:\033[00m Cannot find config.js');
      console.log('\nTry running "accessor init" to generate a config.js file.');
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Get status of accessors defined within the config.js file')
  .action(() => {
    status();
  })

program.parse(process.argv);

let command = program.args[0];
if(!command) {
  console.log("\nInvalid Command.")
  program.help();
} else if(command._name != 'init' && command._name != 'build' && command._name != 'status') {
  console.log("\nInvalid Command.")
  program.help();
}