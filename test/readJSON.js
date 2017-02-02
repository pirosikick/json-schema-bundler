const test = require('ava');
const readJSON = require('../lib/readJSON');

test(t => {
  const file = `${__dirname}/fixtures/a.json`;
  return readJSON(file).then(data => (
    t.deepEqual(data, {
      $ref: 'module:./b.json',
    })
  ));
});

test('file not exists', t => {
  t.plan(1);
  return readJSON('not_exists.json').catch(err => (
    t.regex(err.message, /^readJSON failed/)
  ));
});

test('invalid JSON format', t => {
  t.plan(1);
  const file = `${__dirname}/fixtures/invalid-json.json`;
  return readJSON(file).catch(err => (
    t.regex(err.message, /^readJSON failed/)
  ));
});
