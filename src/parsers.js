import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

export default (filename) => {
  switch (path.extname(filename)) {
    case '.json':
      return JSON.parse;
    case '.yaml':
      return yaml.safeLoad;
    case '.ini':
      return ini.parse;
    default:
      throw new Error(`Invalid extension of '${filename}'.`);
  }
};
