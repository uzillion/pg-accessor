const path = require('path');
const writeFile = require('./file_builder');

let counter = 0;

let template = ((__args) => {
  return db.any(QUERY, [__args])
    .then((data) => {
      return data;
    }).catch((err) => {
      throw err;
    });
}).toString();

const genGetter = (table_name, getter_conf) => {
  // console.log(tab)
  counter = 1;
  let argRegEx = /^\$.*/;
  let header = `const db = require('./index');\n`;
  let func_name = getter_conf.name;
  let footer = `module.exports = ${func_name};`;
  let contents = header + "\n";
  let args = [];
  
  let columns = getter_conf.select;
  let conditions = Object.values(getter_conf.where);
  
  let columns_string = `SELECT ${getSelectString(columns)} FROM ${table_name}`;
  let condition_string = "";
  
  if(conditions.length >= 1)
    condition_string = `WHERE ${getWhereString(getter_conf.where)}`;
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
  
  contents += `\nconst ${func_name} = ${template.replace(/__args/g, args_string)}\n`;
  contents += footer;

  writeFile(path.resolve(`./db/${func_name}.js`), contents);

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

module.exports = genGetter;