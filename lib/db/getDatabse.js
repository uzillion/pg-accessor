const db = require('./index');

const getDatabaseQuery =  `SELECT current_database()`;

const getDatabase = () => {
  return db.one(getDatabaseQuery)
    .then((result) => {
      return result.current_database;
    }).catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = getDatabase;