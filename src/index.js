const assert = require('assert');
const path = require('path');
const VError = require('verror');
const co = require('co');
const readFile = require('./readFile');
const resolve = require('./resolve');

function resolveRef(ref, baseFile) {
  return co(function* resolveRefInner() {
    if (/^module:(.+)/.test(ref)) {
      const id = RegExp.$1;
      const basedir = path.dirname(baseFile);
      const file = yield resolve(id, basedir);
      const extname = path.extname(file);
      switch (extname) {
        case '.js': {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          return require(file);
        }

        case '.json': {
          const data = yield readFile(file);
          return JSON.parse(data);
        }

        default:
          return undefined;
      }
    }
    return undefined;
  }).catch(cause => {
    throw new VError(
      cause,
      "failed to resolve $ref: '%s' in '%s'", ref, baseFile
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
