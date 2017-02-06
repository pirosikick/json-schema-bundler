const test = require('ava');
const path = require('path');
const readYAML = require('../lib/readYAML');

test(function* (t) {
  const filename = path.join(__dirname, './fixtures/yaml-file.yml');
  const data = yield readYAML(filename);
  t.deepEqual(data, { type: 'string', example: 'yaml file' });
});
