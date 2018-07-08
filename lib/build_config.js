const fs = require('fs');
const getColumns = require('./db/getColumns');
const path = require('path');
// getColumns("mintradeworth").then((result) => console.log(result));
const buildContents = async (tables) => {
  let contents = {};
  for(let i=0 ; i < tables.length ; i++) {
    let tokens = tables[i].split('_');
    let table_name = "";
    tokens.forEach((token) => {
      table_name += token.charAt(0).toUpperCase() + token.substr(1);
    });
    await getColumns(tables[i]).then((columns) => {
      contents[`get${table_name}`] = {
        select: columns,
        where: {}
      };
      contents[`set${table_name}`] = {
        set: {},
        where: {}
      };
    });
  };
  // console.log(path.resolve('.')+'/db/config.js');
  // console.log(+'/db/config.js');
  fs.writeFile(path.resolve('./db/config.js'), "module.exports = "+JSON.stringify(contents, null, 2), ()=>{})
  // console.log("module.exports = "+JSON.stringify(contents, null, 2));
};

const genConf = (tables) => {

  buildContents(tables);
  // tables.forEach((table) => {

  // })

}

module.exports = genConf;
