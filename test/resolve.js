const test = require('ava');
const path = require('path');
const resolve = require('../lib/resolve');

test('resolve("./fixtures/a.json")', t => {
  const id = './fixtures/a.json';
  return resolve(id, __dirname).then(file => {
    t.is(file, path.join(__dirname, 'fixtures/a.json'));
  });
});
