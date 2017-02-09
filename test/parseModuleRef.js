const test = require('ava');
const parseModuleRef = require('../lib/parseModuleRef');

function testResults(t, input, output) {
  t.deepEqual(parseModuleRef(input), output);
}

const records = [
  {
    input: 'module:./hoge.js',
    output: { valid: true, id: './hoge.js', pointer: undefined },
  },
  {
    input: 'module:some-package#/definitions/hoge',
    output: { valid: true, id: 'some-package', pointer: '/definitions/hoge' },
  },
  {
    input: 'http://example.com/schema.json',
    output: { valid: false },
  },
];

records.forEach(({ input, output }) => (
  test(input, testResults, input, output)
));
