const path = require('path');
const writeFile = require('./file_builder');

let counter = 0;

let template = ((__args) => {
  return db.query(QUERY, [__args])
    .catch((err) => {
      throw err;
    });
}).toString();

const genSetter = (table_name, setter_conf) => {
  // console.log(tab)
  counter = 1;
  let argRegEx = /^\$.*/;
  let header = `const db = require('./index');\n`;
  let func_name = setter_conf.name;
  let footer = `module.exports = ${func_name};`;
  let contents = header + "\n";
  let args = [];
  
  let update_vals = Object.values(setter_conf.set);
  let conditions = Object.values(setter_conf.where);
  
  let update_string = `UPDATE ${setter_conf.base} SET ${getSetString(setter_conf.set)}`;
  let condition_string = "";
  
  if(conditions.length >= 1)
    condition_string = `WHERE ${getWhereString(setter_conf.where)}`;

  contents += `const QUERY = \`${update_string} ${condition_string}\`;\n`;
  while((index = update_vals.findIndex(x => argRegEx.test(x))) != -1) {
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

const getSetString = (update_vals) => {
  let argRegEx = /^\$/;
  let set_string = "";
  Object.entries(update_vals).forEach((new_data, index, data_list) => {
    set_string += new_data[0] + '=';
    set_string += argRegEx.test(new_data[1])?
      `$${counter++}`:
      (typeof new_data[1] == "number"?new_data[1]:`'${new_data[1]}'`);
    if(index < data_list.length-1)
      set_string += ', ';
    // console.log(condition);
  });
  // console.log(condition_string);
  return set_string;
}

const getWhereString = (conditions) => {
  let argRegEx = /^\$/;
  let condition_string = "";
  Object.entries(conditions).forEach((condition, index, condition_list) => {
    condition_string += condition[0] + '=';
    condition_string += argRegEx.test(condition[1])?
      `$${counter++}`:
      (typeof condition[1] == "number"?condition[1]:`'${condition[1]}'`);
    if(index < condition_list.length-1)
      condition_string += ' AND ';
    // console.log(condition);
  });
  // console.log(condition_string);
  return condition_string;
}

module.exports = genSetter;