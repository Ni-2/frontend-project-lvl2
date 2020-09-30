import fs from 'fs';
import path from 'path';
import union from 'lodash/union';
import has from 'lodash/has';
import parsers from './parsers.js';
import formatters from './formatters/index.js';

const findIntegers = (data) => Object.entries(data).reduce((acc, [key, value]) => {
  if (typeof value === 'object') acc[key] = findIntegers(value);
  else if (parseInt(value, 10).toString() === value) acc[key] = parseInt(value, 10);
  else if (parseFloat(value).toString() === value) acc[key] = parseFloat(value);
  else acc[key] = value;
  return acc;
}, {});

const getData = (filepath) => {
  const absoluteFilename = path.resolve(process.cwd(), filepath);
  const data = fs.readFileSync(absoluteFilename, 'utf-8');
  const parse = parsers(filepath);
  const parcedData = parse(data);
  if (path.extname(filepath) === '.ini') return findIntegers(parcedData);
  return parcedData;
};

const genNode = (name, type, value, value2 = undefined) => ({
  name, type, value, value2,
});

const compare = (data1, data2) => union(Object.keys(data1), Object.keys(data2))
  .sort()
  .map((key) => {
    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      return { name: key, type: 'list', children: compare(data1[key], data2[key]) };
    }
    const items = [key];
    if (data1[key] === data2[key]) items.push('not changed', data2[key]);
    else if (!has(data1, key)) items.push('added', data2[key]);
    else if (!has(data2, key)) items.push('removed', data1[key]);
    else items.push('modified', data1[key], data2[key]);
    return genNode(...items);
  });

export default (filepath1, filepath2, format) => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);
  const diff = compare(data1, data2);
  return formatters(format)(diff);
};
