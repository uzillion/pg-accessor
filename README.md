# pg-accessor
[![Build Status](https://travis-ci.org/uzillion/pg-accessor.svg?branch=master)](https://travis-ci.org/uzillion/pg-accessor)

pg-accessor is a handy Node.js package for PostgreSQL databases that makes creating Promise based getter and setter functions for the tables a breeze. 

The getter and setter functions are built using the amazing [pg-promise][] package for async data management. Please refer to its [documentation][] if you want to know more about the pg-promise functions generated by this package.

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [The config.js file](#the-configjs-file)
  + [1. getter {..}](#1-getter-)
  + [2. setter {..}](#2-setter-)
  + [3. Parameterized Values](#3-parameterized-values)
  + [4. Custom Accessors](#4-custom-accessors)
* [Examples](#examples)
* [Contributing](#contributing)
* [Contact](#contact)
* [License](#license)

## Installation
```bash
# For easiest use, install in global:
npm install -g pg-accessor 
# Usage: accessor <command>

# Local installation (relative path required):
npm install pg-accessor 
# Usage: ./node_modules/.bin/accessor <command>
```
    
## Usage
The usage is pretty straightforward.
* First run `accessor init`. 
* This will create config.js file in the ./db folder.
* The config.js file consists of an object with various specifications that are easily customizable.
  + Refer [here](#the-configjs-file) to learn how.
* Once you're done customizing the config.js file, run `accessor build`. 
* This will generate getter and setter files with the specifications defined in config.js.

**Notes** : 
* For using pg-accessor, the postgres database url needs to be exported to the environment as "DATABASE_URL"
* It is recommended you use underscore in table names to seperate different words. Eg: _my_table_, _order_id_, etc.

## The config.js file
config.js consists a list of all the database tables further broken down into getter and setter properties. These properties are further divided into required and optional properties. If one of the required child property is left empty, the parent property i.e. the getter or setter for that table will not be built.

To prevent the building of both&mdash;getter and setter&mdash;for certain tables, just delete the entire table object from the config.js file.<br>Similarly, to prevent the building of only one&mdash;either the getter or the setter&mdash;of a certain table, just delete the getter/setter objects of that table. Refer to the [examples](#examples) section to learn more.

Below are the general specificiations of various properties, and how you can use them.
### **1. getter {..}**
| Property |  Type  | Required |                                                                                              Description                                                                                              |
|:--------:|:------:|:--------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   name   | String |    Yes   | The name of the getter function.<br>Autogenerated, but can be changed as desired.                                                                                                                     |
|  select  |  Array |    Yes   | The columns to be pulled from database.<br>By default contains all the columns in the table, but can delete the ones that are not required.<br>If all columns are required, just put an asterisk (*). |
|   from   | String |    Yes   | The name of the table you want to obtain the data from.<br>Autogenerated, but can be altered to use more complex tables like in case of joins.                                                        |
|   where  | Object |    No    | Conditions specified in form of key value pairs.<br>Eg: `{"name":"John", "id":123}`                                                                                                                   |

### **2. setter {..}**
| Property |  Type  | Required |                                                                                   Description                                                                                  |
|:--------:|:------:|:--------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   name   | String |    Yes   | The name of the setter function.<br>Autogenerated, but can be changed as desired.                                                                                              |
|   base   | String |    Yes   | The name of the table you want to update the data in.                                                                                                                          |
|    set   | Object |    Yes   | The new values in the form of key-value pairs.<br>The keys are essentially the column names, and the values are the new data you want to put in that column.<br>Eg: `{"age":18}` |
|   where  | Object |    No    | Conditions specified in form of key value pairs.<br>Eg: `{"name":"John", "id":123}`                                                                                            |

### **3. Parameterized Values**
It is possible to create field values of the getter and setter function to be parameterized. These values will not be predefined, but will be sent as arguments to the getter or setter function during the time of execution of your program

To create a parameterized field, just use a dollar sign ($) followed by the variable name. For example, if you want to get username as an argument to the _WHERE_ clause of a getter function, just add the following to the "where" object: `username: $username`. Refer to [examples](#examples) section for better examples.

### **4. Custom Accessors**
It is also possible to create additional custom accessors. This may be needed when more than one getter/setter is required for the same table.

To do so, you just need to create another table object that matches the general structure. Refer to [this][] example to learn more.

## Examples
Below are the examples of customizing the config.js file to fit the needs of user.
#### 1. Generate getter and setter for _USERS_ table.
The following config.js file will return all columns and rows for the getter; and will will update the age of a particular user using the user parameter to setter.
```javascript
// config.js
module.exports = {
  "USERS": {              // Table object
    "getter": {
      "name": "getUsers", // Autogenerated
      "select": ["*"],    // Was autogenerated with as ["id","user","age","city"], but changed it to ["*"].
      "from": "Users",    // Autogenerated
      "where": {}         // No condition clause
    },
    "setter": {
      "name": "setAge",   // Was autogenerated as setUsers, but changed it to setAge
      "base": "Users",    // Autogenerated
      "set": {
        "age": "$age"     // Creating a parameter for age, that is to be sent to the setter function.
      },
      "where": {
        "user": "$user"   // Like above creating a parameter for user
      }
    }
  }
}
```

**The resulting output files will look like:**
```javascript
// getUsers.js
const db = require('./index');

const QUERY = `SELECT * FROM Users`;

const getUsers = () => {
  return db.any(QUERY, [])
    .then((data) => {
      return data;
    }).catch((err) => {
      throw err;
    });
}
module.exports = getUsers;
```
```javascript
// setAge.js
const db = require('./index');

const QUERY = `UPDATE Users SET age=$1 WHERE user=$2`;

const setAge = (age,user) => {
  return db.query(QUERY, [age,user])
    .catch((err) => {
      throw err;
    });
}
module.exports = setAge;
```
<hr>

#### 2. Generating a getter with a complex _FROM_ clause. 
The generated getter function will return the user's name and salary of the ones living in San Francisco, and of the age as passed as a parameter to the getter function.
```javascript
// config.js
module.exports = {
  "USERS": {
    "getter": {
      "name": "getSalary",          // Was autogenerated to "getUsers", but changed to "getSalary".
      "select": ["user", "salary"], // Selecting user and salary columns
      "from": "users INNER JOIN employees ON users.id = employees.id", // Complex FROM clause
      "where": {
        "age": "$age",              // age parameter
        "city": "San Francisco"
      }
    } // Setter was autogenerated after this, but deleted it because was not required.
  }
}
```
<hr>

#### 3. Creating additional accessors
```javascript
// config.js
module.exports = {
  .  //
  .  // Previously autogenerated table objects
  .  //
  }, //
  MyCustomAccessor: { // Manually built table object
    "getter": {
      "name": "getCity",
      "select": ["user","id"],
      "from": "users"
      "where": {
        "user": "$name"
      }
    }, 
    "setter": {
      "name": "setCity",
      "base": "users"
      "set": {
        "city": "$city"
      },
      "where": {
        "user": "$name"
      } 
    }
  }
}
```

## Contributing
If you are a developer trying to contribute to this project, please follow these steps:
1. Fork and Clone the repository.
2. Run `npm install`.
3. Export the DATABASE_URL environment variable.
4. Run `npm start <command>` or `./index.js <command>` to see if it runs without errors.
    + If you wish to be able to execute `./index.js <command>` directly instead of `npm start <command>`, export `NODE_ENV=development` to the environment.
5. Tests can be performed by running `npm test`

Please refer [Contribution Guidelines][] for more information.

**Note** : "DATABASE_URL" needs to be present as an environment variable to be able to connect to the database. It is recommended that you do this using the [dotenv][] package that is included as a dev-dependency. Using _dotenv_ you can easily load DATABASE_URL and other environment variables from a ".env" file without having to export them everytime. 

## Contact
**Email** : uzair_inamdar@hotmail.com<br>
**Telegram** : @uzair_inamdar

## License
[MIT](LICENSE)


[pg-promise]: https://github.com/vitaly-t/pg-promise
[documentation]: https://github.com/vitaly-t/pg-promise/#documentation
[Issues]: https://github.com/uzillion/pg-accessor/issues
[this]: #3-creating-additional-accessors
[dotenv]: https://www.npmjs.com/package/dotenv
[Contribution Guidelines]: https://github.com/uzillion/pg-accessor/blob/master/CONTRIBUTING.md
