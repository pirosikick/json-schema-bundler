const assert = require('assert');
const VError = require('verror');
const result = require('lodash.result');

function isPointerValid(pointer) {
  // maybe ESLint bug
  // eslint-disable-next-line no-useless-escape
  return /^\/[^\/]+/.test(pointer);
}

/**
 * [TODO] function name
 *
 * @param {object} schema
 * @param {string} pointer
 * @return {object|undefined}
 */
function getByPointer(schema, pointer) {
  assert(typeof schema === 'object', 'schema must be object');
  assert(typeof pointer === 'string', 'pointer must be string');

  if (!isPointerValid(pointer)) {
    throw new VError("invalid pointer: '%s'", pointer);
  }

  const path = pointer.slice(1).replace('/', '.');
  return result(schema, path);
}

module.exports = getByPointer;
