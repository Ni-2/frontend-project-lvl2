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

const difference = (data1, data2, depth = 1) => {
  const allKeys = _.union(Object.keys(data1), Object.keys(data2)).sort();
  const diff = allKeys.map((key) => {
    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      return `  ${key}: ${difference(data1[key], data2[key], depth + 2)}`;
    }
    if (typeof data1[key] === 'object') {
      return `- ${key}: ${difference(data1[key], data1[key], depth + 2)}\
${data2[key] ? `\n${'  '.repeat(depth)}+ ${key}: ${data2[key]}` : ''}`;
    }
    if (typeof data2[key] === 'object') {
      return `${data1[key] ? `- ${key}: ${data1[key]}\n${'  '.repeat(depth)}` : ''}\
+ ${key}: ${difference(data2[key], data2[key], depth + 2)}`;
    }
    if (!_.has(data1, key)) return `+ ${key}: ${data2[key]}`;
    if (!_.has(data2, key)) return `- ${key}: ${data1[key]}`;
    if (data1[key] !== data2[key]) {
      return `- ${key}: ${data1[key]}\n${'  '.repeat(depth)}+ ${key}: ${data2[key]}`;
    }
    return `  ${key}: ${data2[key]}`;
  });
  return `{\n${'  '.repeat(depth)}${diff.join(`\n${'  '.repeat(depth)}`)}\n${'  '.repeat(depth - 1)}}`;
};

export default (filename1, filename2) => {
  const data1 = getData(filename1);
  const data2 = getData(filename2);
  return difference(data1, data2);
};
