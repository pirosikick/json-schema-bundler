function isObject(value) {
  return typeof value === 'object';
}

function isTypeObject(schema) {
  return schema.type && schema.type === 'object';
}

function isTypeArray(schema) {
  return schema.type && schema.type === 'array';
}

function replace(schema, replaceFun) {
  const newSchema = Object.assign({}, schema);

  if (isObject(schema.definitions)) {
    const keys = Object.keys(schema.definitions);
    newSchema.definitions = keys.reduce((current, key) => (
      Object.assign(current, {
        [key]: replace(schema.definitions[key], replaceFun),
      })
    ), {});
  }

  ['allOf', 'anyOf', 'oneOf'].forEach(field => {
    if (!Array.isArray(schema[field])) {
      return;
    }
    newSchema[field] = schema[field].map(value => replace(value, replaceFun));
  });

  if (isTypeObject(schema) && isObject(schema.properties)) {
    const keys = Object.keys(schema.properties);
    newSchema.properties = keys.reduce((current, key) => (
      Object.assign(current, {
        [key]: replace(schema.properties[key], replaceFun),
      })
    ), {});
  }

  if (isTypeArray(schema) && (Array.isArray(schema.items) || isObject(schema.items))) {
    const items = Array.isArray(schema.items) ? schema.items : [schema.items];
    newSchema.items = items.map(item => replace(item, replaceFun));
  }

  return replaceFun(newSchema) || newSchema;
}

module.exports = replace;
