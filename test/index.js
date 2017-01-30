const test = require('ava');
const bundle = require('../src/index');

test('bundle ./fixtures/a.json', t => (
  bundle(`${__dirname}/fixtures/a.json`).then(schema => {
    t.deepEqual(schema, {
      type: 'string',
      default: 'b.json',
    });
  })
));
