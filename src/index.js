import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';
import formatWith from './formatters/index.js';
import buildTree from './buildTree.js';

const getData = (filepath) => {
  const absoluteFilename = path.resolve(process.cwd(), filepath);
  const data = fs.readFileSync(absoluteFilename, 'utf-8');
  const fileType = path.extname(filepath).slice(1);
  const parse = getParser(fileType);
  return parse(data);
};

export default (filepath1, filepath2, formatter = 'stylish') => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);
  const diff = buildTree(data1, data2);
  return formatWith(formatter)(diff);
};
