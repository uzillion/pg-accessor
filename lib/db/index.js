require('dotenv').config();
const pg = require('pg-promise')();
try {
  module.exports = pg(process.env.DATABASE_URL);
} catch(e) {
  console.error("\n\033[1;31mERROR:\033[00m Unable to connect to the database");
  console.log('\nPlease make sure that:');
  console.log('    1) postgresql service/server is running.')
  console.log('    2) The connection specifications are accurate.');
  console.log('    3) And the databse url is added as "DATABASE_URL" to the environment variables.');
  process.exit(1);
}
