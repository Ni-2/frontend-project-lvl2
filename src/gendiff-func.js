import fs from 'fs';
import path from 'path';
import parsers from './parsers.js';
import formatters from '../formatters/index.js';

const findIntegers = (data) => Object.entries(data).reduce((acc, [key, value]) => {
  if (typeof value === 'object') acc[key] = findIntegers(value);
  else if (parseInt(value, 10).toString() === value) acc[key] = parseInt(value, 10);
  else if (parseFloat(value).toString() === value) acc[key] = parseFloat(value);
  else acc[key] = value;
  return acc;
}, {});

const getData = (filename) => {
  const absoluteFilename = path.resolve(process.cwd(), filename);
  const data = fs.readFileSync(absoluteFilename, 'utf-8');
  const parse = parsers(filename);
  const parcedData = parse(data);
  if (path.extname(filename) === '.ini') return findIntegers(parcedData);
  return parcedData;
};

const genNode = (name, type, value, value2 = undefined) => ({
  name, type, value, value2,
});

const difference = (data1, data2) => Object.keys(data1).concat(Object.keys(data2))
  .reduce((acc, key) => {
    if (!acc.includes(key)) acc.push(key);
    return acc;
  }, [])
  .sort()
  .map((key) => {
    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      return { name: key, type: 'list', children: difference(data1[key], data2[key]) };
    }
    const items = [key];
    if (data1[key] === data2[key]) items.push('not changed', data2[key]);
    else if (!Object.prototype.hasOwnProperty.call(data1, key)) items.push('added', data2[key]);
    else if (!Object.prototype.hasOwnProperty.call(data2, key)) items.push('removed', data1[key]);
    else items.push('modified', data1[key], data2[key]);
    return genNode(...items);
  });

export default (filename1, filename2, format) => {
  const data1 = getData(filename1);
  const data2 = getData(filename2);
  const diff = difference(data1, data2);
  return formatters(format)(diff);
};
