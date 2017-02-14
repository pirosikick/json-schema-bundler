const VError = require('verror');
const co = require('co');
const yaml = require('js-yaml');
const readFile = require('./readFile');

/**
 * read YAML file & parse to JS object
 *
 * @param {string} filename
 * @return {object|array|null}
 */
function readYAML(filename) {
  return co(function* readYAMLInner() {
    const contents = yield readFile(filename);
    return yaml.safeLoad(contents, { filename });
  }).catch(cause => {
    throw new VError(cause, 'readYAML failed: %s', filename);
  });
}

module.exports = readYAML;
