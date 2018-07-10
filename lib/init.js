const getColumns = require('./db/getColumns');
const path = require('path');
const writeFile = require('./file_builder');

const buildContents = async (tables) => {
  let contents = {};

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

  writeFile(path.resolve(`${dest}/config.js`), "module.exports = "+JSON.stringify(contents, null, 2));
};

const genConf = (tables) => {
  return buildContents(tables);
}

module.exports = genConf;
