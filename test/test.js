global.dest = "./db";
const assert = require('assert');
const fs = require('fs');
const getTables = require('../lib/db/getTables');
const init = require('../lib/init');
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
    if(!fs.existsSync('./db')) {
      fs.mkdirSync('./db');
    }
  })

  it('should get tables successfully', (done) => {
    getTables().then(() => {
      done();
    }).catch(done);
  });
  
  it('should build config.js', (done) => {
    getTables().then((tables) => {
      init(tables).then(() => {
        if(!fs.existsSync('./db/config.js'))
          done(new Error("config.js not built."));
        else
          done();
      });
    })
  });

  it('should populate all tables', (done) => {
    getTables().then((tables) => {
      if(Object.keys(require('../db/config')).length === tables.length)
        done();
      else
        done(new Error("Failed to populate all tables."));
    });
  });
});

describe('build()', () => {
  
  it('should build index.js', () => {
    build(require('../db/config'));
    assert(fs.existsSync('./db/index.js'));
  });

  it('should build getter files', (done) => {
    getTables().then((tables) => {
      if((Object.keys(require('../db/config')).length + 2) === fs.readdirSync('./db').length)
        done();
      else
        done(new Error("Failed to build getter files"));
    });
  });

  after(() => {
    fs.readdir('./db', (err, files) => {
      if(err) {
        throw err;
      } else {
        files.forEach((file, index) => {
          fs.unlinkSync('./db/'+file);
        });
        fs.rmdirSync('./db');
      }
    });
  })
});