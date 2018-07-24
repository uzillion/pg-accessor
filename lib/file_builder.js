const fs = require('fs');

const writeFile = (path, contents) => {
  let file = path.split(/[\\\/]/g).pop();
  try {
    fs.writeFileSync(path, contents);
    if(process.env.NODE_ENV != "test")
      console.log(`${dest}/${file} created`);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

module.exports = writeFile;