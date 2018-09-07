const path = require('path');
const writeFile = require('./file_builder');
const fs = require('fs');


const buildContents = async (tables, overwrite) => {
  if(!fs.existsSync(path.resolve(`${dest}/config.js`)) || overwrite) {
    
    const getColumns = require('./db/getColumns');
    const getDatabase = require('./db/getDatabse');
    let contents = {};
    let db_desc = "";

    await getDatabase().then((database) => {
      db_desc += "/*\n\nDATBASE: "+database+"\n";
      db_desc += "TABLES: "+tables.join(", ")+"\n\n*/";
    });

    for(let i=0 ; i < tables.length ; i++) {
      
      let table_name = tables[i];
      let tokens = table_name.split(/[_,-]/g);
      let pretty_table_name = "";
      
      // Transform name to camel case by eliminating "_" and "-"
      tokens.forEach((token) => {
        pretty_table_name += token.charAt(0).toUpperCase() + token.substr(1);
      });
      
      await getColumns(table_name).then((columns) => {
        // Basic table object structure.
        contents[table_name.toUpperCase()] = {
          getter: {
            name: `get${pretty_table_name}`,
            select: columns,
            from: table_name,
            where: {}
          },
          setter: {
            name: `set${pretty_table_name}`,
            base: table_name,
            set: {},
            where: {}
          }
        };
      });
    };
  
    writeFile(path.resolve(`${dest}/config.js`), db_desc+"\nmodule.exports = "+JSON.stringify(contents, null, 2));
  } else {
    console.log(`\n${"\033[1;31m"}${dest}/config.js already exists.${"\033[00m"}\n\nTo rebuild run with overwrite flag (-o/--overwrite)\n`);
    process.exit(1);
  }
};

const genConf = (tables, overwrite) => {
  return buildContents(tables, overwrite);
}

module.exports = genConf;
