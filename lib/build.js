const path = require('path');
const genGetter = require('./getter');
const genSetter = require('./setter');
const writeFile = require('./file_builder');
const fs = require('fs');

const build = (config, overwrite) => {
  let counter = 0;
  if(!fs.existsSync(path.resolve(`${dest}/index.js`)) || overwrite) {
    genIndex();
  } else {
    ++counter;
    console.log("\033[1;31m./db/index.js already exists\033[00m");
  }

  Object.keys(config).forEach((table_name) => {
    let getter_conf = config[table_name].getter;
    let setter_conf = config[table_name].setter;

    if(getter_conf && (getter_conf.select.length > 0)) {
      if(!fs.existsSync(path.resolve(`${dest}/${config[table_name].getter.name}.js`)) || overwrite) {
        genGetter(table_name, config[table_name].getter);
      } else {
        ++counter;
        console.log(`${"\033[1;31m"}${dest}/${config[table_name].getter.name} already exists${"\033[00m"}`);
      }
    }
    
    if(setter_conf && (setter_conf.base.length > 0) && (Object.values(setter_conf.set).length > 0)) {
      if(!fs.existsSync(path.resolve(`${dest}/${config[table_name].setter.name}.js`)) || overwrite) {
        genSetter(table_name, config[table_name].setter);
      } else {
        ++counter;
        console.log(`${"\033[1;31m"}${dest}/${config[table_name].setter.name} already exists${"\033[00m"}`);
      }
    }
  });

  if(counter > 0) {
    console.log("\n\033[38;5;214mWARNING:\033[00m One or more files were not created. Run with overwrite flag (-o) to overwrite existing files.\n");
  }
}

// Generate database index file
const genIndex = () => {
  let index_contents = `const pg = require('pg-promise')();\n`
  index_contents += `const db = pg(process.env.DATABASE_URL);\n`
  index_contents += `module.exports = db;`
  writeFile(path.resolve(`${dest}/index.js`), index_contents);
}

module.exports = build;
