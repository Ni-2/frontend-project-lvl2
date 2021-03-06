import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = { stylish, plain, json };

export default (format) => {
  if (_.has(formatters, format)) return formatters[format];
  throw new Error(`There is no such a formatter: ${format}`);
};
