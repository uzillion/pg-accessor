const path = require('path');
const genGetter = require('./getter');
const writeFile = require('./file_builder');

const build = (config) => {
  genIndex();
  Object.keys(config).forEach((table_name) => {
    genGetter(table_name, config[table_name].getter);
    // let table_name = func_name.slice(3);
  });

}


const genIndex = () => {
  let index_contents = `const pg = require('pg-promise')();\n`
  index_contents += `const db = pg(process.env.DATABASE_URL);\n`
  index_contents += `module.exports = db;`
  writeFile(path.resolve('./db/index.js'), index_contents);
}

module.exports = build;
