import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import has from 'lodash/has';

const parsers = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  ini: ini.parse,
};

export default (filename) => {
  const fileType = path.extname(filename).slice(1);
  if (has(parsers, fileType)) return parsers[fileType];
  throw new Error(`Invalid type of '${filename}'.`);
};
