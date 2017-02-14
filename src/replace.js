const co = require('co');
const reduceAsync = require('./reduceAsync');
const mapAsync = require('./mapAsync');

function isObject(value) {
  return typeof value === 'object';
}

function isTypeObject(schema) {
  return schema.type && schema.type === 'object';
}

function isTypeArray(schema) {
  return schema.type && schema.type === 'array';
}

// eslint-disable-next-line no-shadow
function replaceObject(obj, replace, replaceFun) {
  return reduceAsync(
    obj,
    co.wrap(function* (newObj, val, key) {
      const replaced = yield replace(val, replaceFun);
      return Object.assign(newObj, { [key]: replaced });
    }),
    {}
  );
}

function replace(schema, replaceFun) {
  return co(function* () {
    const newSchema = Object.assign({}, schema);

    for (const field of ['allOf', 'anyOf', 'oneOf']) {
      if (Array.isArray(schema[field])) {
        newSchema[field] = yield mapAsync(
          schema[field],
          subSchema => replace(subSchema, replaceFun)
        );
      }
    }

    if (isObject(schema.definitions)) {
      newSchema.definitions = yield replaceObject(
        schema.definitions,
        replace,
        replaceFun
      );
    }

    if (isTypeObject(schema) && isObject(schema.properties)) {
      newSchema.properties = yield replaceObject(
        schema.properties,
        replace,
        replaceFun
      );
    }

    if (isTypeArray(schema) && schema.items) {
      if (Array.isArray(schema.items)) {
        newSchema.items = yield mapAsync(
          schema.items,
          item => replaceFun(item, replaceFun)
        );
      } else {
        newSchema.items = yield replaceFun(schema.items, replaceFun);
      }
    }

    const result = yield replaceFun(newSchema);
    return result || newSchema;
  });
}


module.exports = replace;
