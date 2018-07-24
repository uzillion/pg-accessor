global.dest = "./test/db";
const assert = require('assert');
const fs = require('fs');
const getTables = require('../lib/db/getTables');
const init = require('../lib/init');
const status = require('../lib/status');
const build = require('../lib/build');

describe('Database connection', () => {
  it('should not give errors', (done) => {
    try {
      require('../lib/db/index');
      done();
    } catch(e) {
      done(e);
    }
  });
});

describe('init()', function() {

  before(() => {
    if(!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
  })

  it('should get tables successfully', (done) => {
    getTables().then(() => {
      done();
    }).catch(done);
  });
  
  it('should build config.js', (done) => {
    getTables().then((tables) => {
      init(tables, true).then(() => {
        if(!fs.existsSync(`${dest}/config.js`))
          done(new Error("config.js not built."));
        else
          done();
      });
    })
  });

  it('should populate all tables', (done) => {
    getTables().then((tables) => {
      if(Object.keys(require('./db/config')).length === tables.length)
        done();
      else
        done(new Error("Failed to populate all tables."));
    });
  });
});

describe('status()', () => {

  it('should successfully grab status of all functions', (done) => {
    try {
      status()
      done();
    } catch(e) {
      done(e);
    }
  })
});

describe('build()', () => {
  
  it('should build index.js', () => {
    build(require('./db/config'), true);
    assert(fs.existsSync(`${dest}/index.js`));
  });

  it('should build getter files', (done) => {
    getTables().then((tables) => {
      if((Object.keys(require('./db/config')).length + 2) === fs.readdirSync(dest).length)
        done();
      else
        done(new Error("Failed to build getter files"));
    });
  });

  after(() => {
    fs.readdir(dest, (err, files) => {
      if(err) {
        console.error(err);
        process.exit(1);
      } else {
        files.forEach((file, index) => {
          fs.unlinkSync(dest+'/'+file);
        });
        fs.rmdirSync(dest);
      }
    });
  })
});