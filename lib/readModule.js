const path = require('path');
const VError = require('verror');
const co = require('co');
const readJSON = require('./readJSON');
const resolve = require('./resolve');

function readModule(id, basedir) {
  return co(function* readModuleInner() {
    const file = yield resolve(id, basedir);
    const extname = path.extname(file);

    switch (extname) {
      case '.js': {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require(file);
      }
      case '.json': {
        return yield readJSON(file);
      }
      default:
        return undefined;
    }
  }).catch(cause => {
    throw new VError({ cause, info: { id, basedir } }, 'readModule failed');
  });
}

module.exports = readModule;
