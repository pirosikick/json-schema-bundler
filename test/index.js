const test = require('ava');
const bundle = require('../src/index');

test('bundle("./fixtures/a.json")', t => {
  const file = `${__dirname}/fixtures/a.json`;
  return bundle(file).then(schema => {
    t.deepEqual(schema, {
      type: 'string',
      default: 'b.json',
    });
  });
});

test('bundle("./fixtures/c.json")', t => {
  const file = `${__dirname}/fixtures/c.json`;
  return bundle(file).then(schema => {
    t.deepEqual(schema, {
      type: 'string',
      example: 'd.js',
    });
  });
});
