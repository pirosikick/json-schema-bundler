const assert = require('assert');
const fs = require('fs');
const VError = require('verror');

/**
 * fs.readFile Promise wrapper
 *
 * @param {string} file - file path to read
 * @return {Promise<string>}
 */
module.exports = function readFile(file) {
  return new Promise((resolve, reject) => {
    assert(typeof file === 'string', 'file must be string');

    fs.readFile(file, (err, data) => {
      if (err) {
        reject(new VError({
          cause: err,
          info: { file },
        }, 'failed to read file'));
        return;
      }
      resolve(data);
    });
  });
};
