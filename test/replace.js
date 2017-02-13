const test = require('ava');
const sinon = require('sinon');
const replace = require('../lib/replace');

test(function* (t) {
  const schema = {
    type: 'object',
    allOf: [{ type: 'object' }],
    definitions: {
      a: { type: 'string' },
    },
    properties: {
      a: { $ref: '#/definitions/a' },
    },
  };

  const replaceFun = sinon.spy(s => (s.$ref ? { type: 'number' } : s));
  const replaced = yield replace(schema, replaceFun);
  const expected = {
    type: 'object',
    definitions: {
      a: { type: 'string' },
    },
    allOf: [{ type: 'object' }],
    properties: {
      a: { type: 'number' },
    },
  };

  t.deepEqual(replaced, expected);
  t.is(replaceFun.callCount, 4);
  t.deepEqual(replaceFun.args[0], [{ type: 'object' }]);
  t.deepEqual(replaceFun.args[1], [{ type: 'string' }]);
  t.deepEqual(replaceFun.args[2], [{ $ref: '#/definitions/a' }]);
  t.deepEqual(replaceFun.args[3], [expected]);
});

test('async replaceFun', function* (t) {
  const schema = { type: 'string' };
  const actual = yield replace(
    schema,
    () => Promise.resolve({ type: 'number' })
  );
  t.deepEqual(actual, { type: 'number' });
});
