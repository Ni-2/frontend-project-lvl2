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

const difference = (data1, data2) => {
  const allKeys = Object.keys(data1).concat(Object.keys(data2))
    .reduce((acc, val) => {
      if (!acc.includes(val)) acc.push(val);
      return acc;
    }, []).sort();
  return allKeys.reduce((acc, key) => {
    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      acc[key] = difference(data1[key], data2[key]);
      return acc;
    }
    const hasGDChange = data1[key] !== data2[key];
    acc[key] = { hasGDChange };
    if (hasGDChange) {
      if (Object.prototype.hasOwnProperty.call(data1, key)) {
        acc[key].value1 = data1[key];
      }
      if (Object.prototype.hasOwnProperty.call(data2, key)) {
        acc[key].value2 = data2[key];
      }
    } else acc[key].value = data1[key];
    return acc;
  }, {});
};

export default (filename1, filename2, format) => {
  const data1 = getData(filename1);
  const data2 = getData(filename2);
  const diff = difference(data1, data2);
  return formatters(format)(diff);
};
