import fs from 'fs';
import path from 'path';
import parsers from './parsers.js';
import formatters from './formatters/index.js';
import buildTree from './buildTree.js';

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

export default (filepath1, filepath2, format) => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);
  const diff = buildTree(data1, data2);
  return formatters(format)(diff);
};
