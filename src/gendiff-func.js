import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const getData = (filename) => {
  const absoluteFilename = path.resolve(process.cwd(), filename);
  const dataJson = fs.readFileSync(absoluteFilename);
  const parsedJson = JSON.parse(dataJson);
  return parsedJson;
};

export default (filename1, filename2) => {
  const data1 = getData(filename1);
  const data2 = getData(filename2);
  const allKeys = _.union(Object.keys(data1), Object.keys(data2)).sort();
  return allKeys.map((key) => {
    if (!_.has(data1, key)) return `+ ${key}: ${data2[key]}`;
    if (!_.has(data2, key)) return `- ${key}: ${data1[key]}`;
    if (data1[key] !== data2[key]) return `- ${key}: ${data1[key]}\n+ ${key}: ${data2[key]}`;
    return `  ${key}: ${data2[key]}`;
  }).join('\n');
};