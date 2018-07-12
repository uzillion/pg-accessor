const fs = require('fs');

const writeFile = (path, contents) => {
  try {
    fs.writeFileSync(path, contents);
    if(process.env.NODE_ENV != "test")
      console.log(`${path} created`);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

module.exports = writeFile;