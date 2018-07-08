// if(process.env.NODE_ENV == "development") {
  require('dotenv').config();
// }
const getTables = require('./lib/db/getTables');
const genConfig = require('./lib/build_config');

getTables().then((tables) => {
  genConfig(tables);
});
