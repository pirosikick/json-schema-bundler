const resolve = require('resolve');

/**
 * node-resolve promise wrapper
 */
module.exports = function resolveWrapper(id, basedir) {
  return new Promise((fullfill, reject) => {
    resolve(id, { basedir }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        fullfill(res);
      }
    });
  });
};
