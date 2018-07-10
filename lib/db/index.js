if(process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
  require('dotenv').config();
}
const pg = require('pg-promise')();
module.exports = pg(process.env.DATABASE_URL);
