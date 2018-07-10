const path = require('path');
const genGetter = require('./getter');
const genSetter = require('./setter');
const writeFile = require('./file_builder');

const build = (config) => {
  genIndex();

  Object.keys(config).forEach((table_name) => {
    let getter_conf = config[table_name].getter;
    let setter_conf = config[table_name].setter;

    if(getter_conf && (getter_conf.select.length > 0))
      genGetter(table_name, config[table_name].getter);
    
    if(setter_conf && (setter_conf.base.length > 0) && (Object.values(setter_conf.set).length > 0))
      genSetter(table_name, config[table_name].setter);
  });

}

// Generate database index file
const genIndex = () => {
  let index_contents = `const pg = require('pg-promise')();\n`
  index_contents += `const db = pg(process.env.DATABASE_URL);\n`
  index_contents += `module.exports = db;`
  writeFile(path.resolve(`${dest}/index.js`), index_contents);
}

module.exports = build;
