const getColumns = require('./db/getColumns');
const path = require('path');
const writeFile = require('./file_builder');

const buildContents = async (tables) => {
  let contents = {};
  for(let i=0 ; i < tables.length ; i++) {
    let tokens = tables[i].split('_');
    let table_name = "";
    tokens.forEach((token) => {
      table_name += token.charAt(0).toUpperCase() + token.substr(1);
    });
    await getColumns(tables[i]).then((columns) => {
      contents[table_name.toUpperCase()] = {
        getter: {
          name: `get${table_name}`,
          select: columns,
          where: {}
        },
        setter: {
          name: `set${table_name}`,
          set: {},
          where: {}
        }
      };
    });
  };

  writeFile(path.resolve('./db/config.js'), "module.exports = "+JSON.stringify(contents, null, 2));
};

const genConf = (tables) => {
  buildContents(tables);
}

module.exports = genConf;
