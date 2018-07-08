const db = require('./index');


const getColumnsQuery =  `SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = 'public'
  AND table_name = $1`;

const getColumns = (table_name) => {
  return db.many(getColumnsQuery, [table_name])
    .then((result) => {
      let columns = [];
      result.forEach((column_obj) => {
        columns.push(column_obj.column_name);
      });
      return columns;
    }).catch((error) => {
      throw error;
    });
}

module.exports = getColumns;