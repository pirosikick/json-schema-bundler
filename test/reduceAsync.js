const test = require('ava');
const co = require('co');
const reduceAsync = require('../lib/reduceAsync');

test(function* (t) {
  const result = yield reduceAsync(
    [1, 2, 3],
    co.wrap(function* (res, num) {
      return yield Promise.resolve(res + num);
    }),
    Promise.resolve(0)
  );
  t.is(result, 6);
});
