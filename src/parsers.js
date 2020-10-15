import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const iniParseWithNumbers = (data) => {
  const findNumbers = (parsedData) => Object.entries(parsedData)
    .reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) acc[key] = findNumbers(value);
      else if (parseFloat(value).toString() === value) acc[key] = parseFloat(value);
      else acc[key] = value;
      return acc;
    }, {});
  return findNumbers(ini.parse(data));
};

const parsers = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  yml: yaml.safeLoad,
  ini: iniParseWithNumbers,
};

export default (type) => {
  if (_.has(parsers, type)) return parsers[type];
  throw new Error(`Invalid type of '${type}'.`);
};
