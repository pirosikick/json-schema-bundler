const path = require('path');
const VError = require('verror');
const co = require('co');
const readModule = require('./readModule');
const getByPointer = require('./getByPointer.js');

function resolveRef(ref, baseFile) {
  return co(function* resolveRefInner() {
    const [uri, pointer] = ref.split('#');

    if (/^module:(.+)/.test(uri)) {
      const id = RegExp.$1;
      const basedir = path.dirname(baseFile);
      const schema = yield readModule(id, basedir);
      if (typeof pointer === 'string') {
        return getByPointer(schema, pointer);
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

module.exports = resolveRef;
