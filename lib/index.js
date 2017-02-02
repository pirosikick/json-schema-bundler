const assert = require('assert');
const path = require('path');
const VError = require('verror');
const co = require('co');
const ldResult = require('lodash.result');
const readJSON = require('./readJSON');
const readFile = require('./readFile');
const resolve = require('./resolve');

function getModule(id, basedir) {
  return co(function* getModuleInner() {
    const file = yield resolve(id, basedir);
    const extname = path.extname(file);

    switch (extname) {
      case '.js': {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require(file);
      }
      case '.json': {
        return yield readJSON(file);
      }
      default:
        return undefined;
    }
  }).catch(cause => {
    throw new VError({ cause, info: { id, basedir } }, 'getModule failed');
  });
}

function isPointerValid(pointer) {
  assert(typeof pointer === 'string', 'pointer must be string');
  // maybe ESLint bug
  // eslint-disable-next-line no-useless-escape
  return /^\/[^\/]+/.test(pointer);
}

function resolveRef(ref, baseFile) {
  return co(function* resolveRefInner() {
    const [uri, pointer] = ref.split('#');

    if (/^module:(.+)/.test(uri)) {
      const id = RegExp.$1;
      const basedir = path.dirname(baseFile);
      let schema = yield getModule(id, basedir);
      if (typeof pointer === 'string') {
        if (!isPointerValid(pointer)) {
          throw new VError("invalid pointer: '%s'", pointer);
        }

        schema = ldResult(schema, pointer.slice(1).replace('/', '.'));
        if (typeof schema !== 'object') {
          throw new VError("no schema which the pointer points: '%s'", pointer);
        }
        // [TODO] check if schema is valid
        return schema;
      }
      return schema;
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
