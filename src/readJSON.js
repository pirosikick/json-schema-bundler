const assert = require('assert');
const VError = require('verror');
const readFile = require('./readFile');

module.exports = function readJSON(file) {
  assert(typeof file === 'string', 'file must be string');

  return readFile(file)
    .then(text => JSON.parse(text))
    .catch(cause => {
      throw new VError(cause, "readJSON failed: '%s'", file);
    });
};
