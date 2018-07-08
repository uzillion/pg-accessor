const fs = require('fs');
const path = require('path');
let counter = 1;

let getter_template = ((__args) => {
  return db.any(QUERY, [__args])
    .then((data) => {
      return data;
    }).catch((err) => {
      throw err;
    });
}).toString();

const genFiles = (config) => {
  let argRegEx = /^\$.*/;
  genIndex();
  Object.keys(config).forEach((func_name) => {
    let table_name = func_name.slice(3);
    let header = `const db = require('./index');\n`;
    let footer = `module.exports = ${func_name};`;
    let contents = header + "\n";
    let args = [];
    if(func_name.substr(0,3) == "get") {
      let columns = config[func_name].select;
      let conditions = Object.values(config[func_name].where);
      // let columns_string = JSON.stringify(columns).replace('[','').replace(']','');
      // columns_string = columns_string.replace(/"/g, "").replace(/,/g, ', ');
      let columns_string = `SELECT ${getSelectString(columns)} FROM ${table_name}`;
      let condition_string = "";
      if(conditions.length >= 1)
        condition_string = `WHERE ${getWhereString(config[func_name].where)}`;
      contents += `const QUERY = \`${columns_string} ${condition_string}\`;\n`;
      while((index = columns.findIndex(x => argRegEx.test(x))) != -1) {
        args.push(columns[index].replace(/^\$/,''));
        columns.splice(index, 1);
      }
      while((index = conditions.findIndex(x => argRegEx.test(x))) != -1) {
        args.push(conditions[index].replace(/^\$/,''));
        conditions.splice(index, 1);
      }

      let args_string = JSON.stringify(args).replace('[', '').replace(']','').replace(/"/g, '');

      contents += `\nconst ${func_name} = ${getter_template.replace(/__args/g, args_string)}\n`;
      contents += footer;
    }
    genFile(func_name, contents);
  });

}

const getSelectString = (columns) => {
  let argRegEx = /^\$/;
  let columns_string = "";
  columns.forEach((column, index) => {
    columns_string += argRegEx.test(column)?`$${counter++}`:column;
    if(index < columns.length-1)
      columns_string += ', ';
  });
  return columns_string;
}

const getWhereString = (conditions) => {
  let argRegEx = /^\$/;
  let condition_string = "";
  Object.entries(conditions).forEach((condition, index, condition_list) => {
    condition_string += condition[0] + '=';
    condition_string += argRegEx.test(condition[1])?`$${counter++}`:condition[1];
    if(index < condition_list.length-1)
      condition_string += ' AND ';
    // console.log(condition);
  });
  // console.log(condition_string);
  return condition_string;
}

const genFile = (func_name, contents) => {
  fs.writeFile(path.resolve(`./db/${func_name}.js`), contents, (err) => {
    if(err) {
      console.log(`Failed to build ./db/${func_name}.js`);
      throw err;
    }
    console.log(`./db/${func_name}.js created`);
  });
}

const genIndex = () => {
  let index_contents = `const pg = require('pg-promise')();\n`
  index_contents += `const db = pg(process.env.DATABASE_URL);\n`
  index_contents += `module.exports = db;`
  fs.writeFile(path.resolve('./db/index.js'), index_contents, (err) => {
    if(err) {
      console.log("Failed to build ./db/index.js");
      throw err;
    }
    console.log("./db/index.js created");
  });
}

module.exports = genFiles;
