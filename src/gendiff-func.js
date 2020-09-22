import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parsers from './parsers.js';

const getData = (filename) => {
  const absoluteFilename = path.resolve(process.cwd(), filename);
  const data = fs.readFileSync(absoluteFilename, 'utf-8');
  const parse = parsers(filename);
  return parse(data);
};

const difference = (data1, data2) => {
  const allKeys = _.union(Object.keys(data1), Object.keys(data2)).sort();
  const diff = allKeys.reduce((acc, key) => {
    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      acc[key] = difference(data1[key], data2[key]);
      return acc;
    }
    const hasGDChange = data1[key] !== data2[key];
    acc[key] = hasGDChange ? { value1: data1[key], value2: data2[key], hasGDChange } : { value: data1[key], hasGDChange };
    return acc;
  }, {});
  return diff;
};

export default (filename1, filename2) => {
  const data1 = getData(filename1);
  const data2 = getData(filename2);
  return difference(data1, data2);
};
