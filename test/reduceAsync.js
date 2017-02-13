const test = require('ava');
const reduceAsync = require('../lib/reduceAsync');

test('array', function* (t) {
  const result = yield reduceAsync(
    [1, 2, 3],
    (res, num) => Promise.resolve(res + num),
    Promise.resolve(0)
  );
  t.is(result, 6);
});

test('array', function* (t) {
  const result = yield reduceAsync(
    { a: 1, b: 2, c: 3 },
    (arr, num, key) => {
      arr.push([key, num]);
      return Promise.resolve(arr);
    },
    []
  );
  t.deepEqual(result, [['a', 1], ['b', 2], ['c', 3]]);
});
