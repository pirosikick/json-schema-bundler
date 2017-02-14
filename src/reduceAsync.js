/* eslint-disable func-names */
const co = require('co');
const VError = require('verror');

function hasOwnProperty(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

function reduceAsync(collection, iteratee, acc) {
  return co(function* () {
    let result = typeof acc === 'function'
      ? yield acc()
      : yield Promise.resolve(acc);

    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i += 1) {
        result = yield iteratee(result, collection[i], i);
      }
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in collection) {
        if (hasOwnProperty(collection, key)) {
          result = yield iteratee(result, collection[key], key);
        }
      }
    }

    return result;
  }).catch(cause => {
    throw new VError(cause, 'reduceAsync failed');
  });
}

module.exports = reduceAsync;
