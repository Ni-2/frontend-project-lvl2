import path from 'path';
import yaml from 'js-yaml';

export default (filename) => {
  switch (path.extname(filename)) {
    case '.json':
      return JSON.parse;
    case '.yaml':
      return yaml.safeLoad;
    default:
      throw new Error(`Invalid extension of '${filename}'.`);
  }
};
