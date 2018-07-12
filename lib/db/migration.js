/**
* Run when "npm install" or "npm db:migrate" is run.
* Migrates default data into the newly created tables. 
*/

const db = require('./index');

const createTables = async () => {
  
  try {
    let p1 = db.query(`CREATE TABLE users(
      id INT PRIMARY KEY,
      name char(10),
      city char(10)
    )`)
    
    let p2 = db.query(`CREATE TABLE employees(
      id INT PRIMARY KEY,
      salary INT
    )`);
    await Promise.all([p1, p2]);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

const insertData = async () => {
  let p1 = db.query(`INSERT INTO  users (id, name, city) VALUES
  ($1, $2, $3),
  ($4, $5, $6)
  `,[1, 'alan', 'berlin', 2, 'dennis', 'new york']);
  
  let p2 = db.query(`INSERT INTO employees (id, salary) VALUES
  ($1, $2),
  ($3, $4)
  `,[1, 100000, 4, 90000]);
  
  await Promise.all([p1, p2]);
}


db.query('DROP SCHEMA public CASCADE')
  .then(() => {
    db.query('CREATE SCHEMA public')
      .then(() => {
        createTables().then(() => {
          insertData();
        }).catch((err) => {
          console.error("Migration failed");
          console.error(err);
        });
      })
  })
