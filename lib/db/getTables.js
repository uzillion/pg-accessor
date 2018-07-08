const db = require('./index');


const getTablesQuery =  `SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'`;

const getTables = () => {
  return db.many(getTablesQuery)
    .then((result) => {
      let tables = [];
      result.forEach((table_obj) => {
        tables.push(table_obj.table_name);
      })
      return tables;
    }).catch((error) => {
      throw error;
    });
}

module.exports = getTables;