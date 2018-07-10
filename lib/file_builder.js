const fs = require('fs');

const writeFile = (path, contents) => {
  // fs.writeFile(path, contents, (err) => {
  //   if(err) {
  //     console.log(`Failed to build ${path}`);
  //     throw err;
  //   }
  //   console.log(`${path} created`);
  // });
    fs.writeFileSync = (path, contents);
}

module.exports = writeFile;