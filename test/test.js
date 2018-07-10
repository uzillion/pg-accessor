require('dotenv').config();
global.dest = "./db";
const assert = require('assert');
const fs = require('fs');
const getTables = require('../lib/db/getTables');
const init = require('../lib/init');
const build = require('../lib/build');
const path = require('path');

describe('init test', function() {

  before(() => {
    if(!fs.existsSync(path.resolve('./db'))) {
      fs.mkdirSync(path.resolve('./db'));
    }
  })

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

  describe('config.js building', () => {
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

  describe('Accessor building', () => {
    it('should build index.js', () => {
      build(require('../db/config'));
      assert(fs.existsSync('./db/index.js'));
    });

    it('should build all accessor files', (done) => {
      getTables().then((tables) => {
        if(Object.keys(require('../db/config')).length === (fs.readdirSync('../db').length + 4))
          done();
        else
          done(new Error("Failed to build all accessor files"));
      });
    });
  });
});