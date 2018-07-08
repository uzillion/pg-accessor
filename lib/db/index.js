const pg = require('pg-promise')();
module.exports = pg(process.env.DATABASE_URL);
