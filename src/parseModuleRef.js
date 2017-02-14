function parseModuleRef($ref) {
  if (!/^module:([^#]+)(?:#(.+))?$/.test($ref)) {
    return { valid: false };
  }
  return {
    valid: true,
    id: RegExp.$1,
    pointer: RegExp.$2 || undefined,
  };
}

module.exports = parseModuleRef;
