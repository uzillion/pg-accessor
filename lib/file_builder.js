const fs = require('fs');

const writeFile = (path, contents) => {
  let file = path.split(/[\\\/]/g).pop();
  try {
    fs.writeFileSync(path, contents);
    if(process.env.NODE_ENV != "test")
      console.log(`${"\033[1;32m"}${dest}/${file} created${"\033[00m"}`);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

module.exports = writeFile;