const test = require('ava');
const bundle = require('../lib/index');

test.skip('bundle("./fixtures/entry.json")', t => {
  const file = `${__dirname}/fixtures/entry.json`;
  return bundle(file).then(schema => {
    t.deepEqual(schema, {
      type: 'object',
      definitions: {
        'schema-a': {
          title: 'schema-a',
          type: 'string',
        },
      },
      properties: {
        a: {
          $ref: '#/definitions/schema-a',
        },
      },
    });
  });
});

test.skip('bundle("./fixtures/a.json")', t => {
  const file = `${__dirname}/fixtures/a.json`;
  return bundle(file).then(schema => {
    t.deepEqual(schema, {
      type: 'string',
      default: 'b.json',
    });
  });
});

test.skip('bundle("./fixtures/c.json")', t => {
  const file = `${__dirname}/fixtures/c.json`;
  return bundle(file).then(schema => {
    t.deepEqual(schema, {
      type: 'string',
      example: 'd.js',
    });
  });
});

test.skip('bundle("./fixtures/pointer-ref.json")', t => {
  const file = `${__dirname}/fixtures/pointer-ref.json`;
  return bundle(file).then(schema => {
    t.deepEqual(schema, {
      title: 'account email',
      type: 'string',
      format: 'email',
    });
  });
});
