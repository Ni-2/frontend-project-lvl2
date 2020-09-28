import fs from 'fs';
import path from 'path';
import parsers from './parsers.js';
import formatters from '../formatters/index.js';

const findIntegers = (data) => Object.entries(data).reduce((acc, [key, value]) => {
  if (typeof value === 'object') return { ...acc, [key]: findIntegers(value) };
  if (parseInt(value, 10).toString() === value) return { ...acc, [key]: parseInt(value, 10) };
  if (parseFloat(value).toString() === value) return { ...acc, [key]: parseFloat(value) };
  return { ...acc, [key]: value };
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
    if (data1[key] === data2[key]) {
      return genNode(key, 'not changed', data2[key]);
    }
    if (!Object.prototype.hasOwnProperty.call(data1, key)) {
      return genNode(key, 'added', data2[key]);
    }
    if (!Object.prototype.hasOwnProperty.call(data2, key)) {
      return genNode(key, 'removed', data1[key]);
    }
    return genNode(key, 'modified', data1[key], data2[key]);
  });

export default (filename1, filename2, format) => {
  const data1 = getData(filename1);
  const data2 = getData(filename2);
  const diff = difference(data1, data2);
  return formatters(format)(diff);
};
