const assert = require('assert');
const path = require('path');
const url = require('url');
const VError = require('verror');
const co = require('co');
const readFile = require('./readFile');

function resolveRef(ref, originFile) {
  return co(function* resolveRefInner() {
    const { protocol, path: filepath } = url.parse(ref);
    if (protocol === 'file:') {
      const dir = path.dirname(originFile);
      const file = path.resolve(dir, filepath);
      const data = yield readFile(file);
      return JSON.parse(data);
    }
    return undefined;
  }).catch(cause => {
    throw new VError(
      cause,
      "failed to resolve $ref: '%s' in '%s'", ref, originFile
    );
  });
}

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
