const test = require('ava');
const readModule = require('../lib/readModule');

function* testReadModule(t, id, expected) {
  const actual = yield readModule(id);
  t.deepEqual(actual, expected);
}

test('./fixtures/a.json', testReadModule, 'fixtures/a.json', {
  $ref: 'module:./b.json',
});

test('./fixtures/d', testReadModule, './fixtures/d', {
  type: 'string',
  example: 'd.js',
});

test('./fixtures/yaml-file.yml', testReadModule, './fixtures/yaml-file.yml', {
  type: 'string',
  example: 'yaml file',
});
