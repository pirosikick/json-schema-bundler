const assert = require('assert');
const VError = require('verror');
const co = require('co');
const readFile = require('./readFile');
const resolveRef = require('./resolveRef');

function bundle(file) {
  return co(function* bundleInner() {
    assert(typeof file === 'string', 'file must be string');

    const data = yield readFile(file);
    const schema = JSON.parse(data);
    if (schema.$ref) {
      const refSchema = yield resolveRef(schema.$ref, file);
      if (refSchema) {
        return refSchema;
      }
    }
    return schema;
  }).catch(cause => {
    throw new VError({
      cause,
      info: { file },
    }, "failed to bundle file '%s'", file);
  });
}

module.exports = bundle;
