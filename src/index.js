const assert = require('assert');
const VError = require('verror');
const co = require('co');
const readFile = require('./readFile');
const resolveRef = require('./resolveRef');
const validator = require('./validator');
const draft4 = require('jsonschema/schema/draft-04/schema.json');

function bundle(file) {
  return co(function* bundleInner() {
    assert(typeof file === 'string', 'file must be string');

    const data = yield readFile(file);
    const schema = JSON.parse(data);
    const result = validator.validate(schema, draft4);
    if (!result.valid) {
      throw new VError({
        name: 'ValidationError',
        info: { result, file },
      }, 'schema is invalid', file);
    }

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
