const fs = require('fs');
const path = require('path');
const checkStatus = () => {
  let counter = 0;
  if(fs.existsSync(path.resolve(`${dest}/config.js`))) {
    const config = require(path.resolve(`${dest}/config.js`));
    if(process.env.NODE_ENV != "test") {
      console.log("\033[92m\u2713\033[0m - Valid, \033[91m\u2717\033[0m - Invaid,");
      console.log("\033[38;5;226m\u2B24\033[00m - Valid, but already exists, and will not be built unless run with overwrite flag (-o/--overwrite)\n")
    }
    Object.keys(config).forEach((key) => {
      let table_obj = config[key];
      if(table_obj.getter) {
        let symbol = "";
        if(table_obj.getter != undefined && checkGetter(table_obj.getter)) {
          symbol = "\033[92m\u2713\033[0m";
          if(fs.existsSync(path.resolve(`${dest}/${table_obj.getter.name}.js`))) {
            symbol = "\033[38;5;226m\u2B24\033[00m";
            ++counter;
          }
        } else {
          symbol = "\033[91m\u2717\033[0m";
          ++counter;
        }
        if(process.env.NODE_ENV != "test")
          console.log(`${symbol} ${table_obj.getter.name}`);
      }
      if(table_obj.setter) {
        let symbol = "";
        if(table_obj.setter != undefined && checkSetter(table_obj.setter)) {
          symbol = "\033[92m\u2713\033[0m";
          if(fs.existsSync(path.resolve(`${dest}/${table_obj.setter.name}.js`))) {
            symbol = "\033[38;5;226m\u2B24\033[00m";
            ++counter;
          }
        } else {
          symbol = "\033[91m\u2717\033[0m";
          ++counter;
        }
        if(process.env.NODE_ENV != "test")
          console.log(`${symbol} ${table_obj.setter.name}`);
      }
    });
    
    if(counter > 0 && process.env.NODE_ENV != "test") {
      console.log("\n\033[38;5;214mWARNING:\033[00m One or more accessors may not be built.");
      console.log("\033[38;5;214mWARNING:\033[00m If this is not intended, you are probably missing a mandatory field or the file already exists.\n");
    }
  } else {
    console.log("\nconfig.js not found.\nRun 'accessor init' to first generate the config file.\n");
    process.exit(1);
  }
}


const checkGetter = (getter_obj) => {
  const valid = 
    (typeof getter_obj.name == "string") &&
    (getter_obj.name.length > 0) && 
    (getter_obj.select.length != 0) &&
    (typeof getter_obj.from == "string") && 
    (getter_obj.from.length > 0);
    
  return valid;
}

const checkSetter = (setter_obj) => {
  const valid = 
    (typeof setter_obj.name == "string") &&
    (setter_obj.name.length > 0) &&
    (typeof setter_obj.base == "string") &&
    (setter_obj.base.length > 0) &&
    (Object.values(setter_obj.set).length > 0);

  return valid;
}

module.exports = checkStatus;