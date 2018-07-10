if(process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
  require('dotenv').config();
}
const pg = require('pg-promise')();
try {
  module.exports = pg(process.env.DATABASE_URL);
} catch(e) {
  console.error("\nError: Unable to connect to the database");
  console.log('\nPlease check if the database exists, and "DATABASE_URL" is present in the environment variables');
  process.exit(1);
}
