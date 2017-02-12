const test = require('ava');
const mapAsync = require('../lib/mapAsync');

test(function* (t) {
  const results = yield mapAsync(
    [1, 2, 3],
    val => Promise.resolve(val * 2)
  );
  t.deepEqual(results, [2, 4, 6]);
});
