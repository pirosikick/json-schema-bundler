const { Validator } = require('jsonschema');
const schemaDraft4 = require('jsonschema/schema/draft-04/schema.json');
const hyperSchemaDraft4 = require('jsonschema/schema/draft-04/schema.json');

const validator = new Validator();
validator.addSchema(schemaDraft4);
validator.addSchema(hyperSchemaDraft4);

module.exports = validator;
