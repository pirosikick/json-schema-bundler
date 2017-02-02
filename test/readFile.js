const test = require('ava');
const readFile = require('../lib/readFile');

test('readFile("./fixtures/a.json")', t => (
  readFile(`${__dirname}/fixtures/a.json`).then(data => {
    t.deepEqual(JSON.parse(data), {
      $ref: 'module:./b.json',
    });
  })
));

test('readFile(null)', t => {
  t.plan(1);
  return readFile(null).catch(err => {
    t.is(err.message, 'file must be string');
  });
});

test('readFile("not-exists.json")', t => {
  t.plan(1);
  return readFile('not-exists.json').catch(err => {
    t.regex(err.message, /^failed to read file/);
  });
});
