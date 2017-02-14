const path = require('path');
const VError = require('verror');
const validator = require('./validator');
const schemaType = require('./schemaType');
const readModule = require('./readModule');

function unref(schema, filepath) {
  const $schema = validator.getSchema(schema);
  const validationResult = validator.validate(schema, $schema);
  if (!validationResult.valid) {
    throw new VError({
      name: 'ValidationError',
      info: { validationResult, schema, filepath },
    }, "invalid schema: '%s'", filepath);
  }

  if (schemaType.isObject(schema)) {
    if (schema.properties) {
      schema.properties = Object.keys(schema.properties).reduce((props, field) => {
        const { $ref } = schema.properties[field];
        let property;
        if ($ref && /^module:(.+)$/) {
          property = readModule(RegExp.$1, path.dirname(filepath));
        } else {
          property = unref(schema.properties[field], filepath);
        }
        return Object.assign(props, { [field]: property });
      }, {});
    }

    if (schema.definitions) {
      schema.definitions = Object.keys(schema.definitions).reduce((props, field) => {
        const { $ref } = schema.definitions[field];
        let property;
        if ($ref && /^module:(.+)$/) {
          property = readModule(RegExp.$1, path.dirname(filepath));
        } else {
          property = unref(schema.definitions[field], filepath);
        }
        return Object.assign(props, { [field]: property });
      }, {});
    }

  }
  return schema;
}

module.exports = unref;
