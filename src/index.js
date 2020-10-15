import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import format from './formatters/index.js';
import buildTree from './treeBuilder.js';

const getData = (filepath) => {
  const absoluteFilename = path.resolve(process.cwd(), filepath);
  const data = fs.readFileSync(absoluteFilename, 'utf-8');
  const type = path.extname(filepath).slice(1);
  return parse(type)(data);
};

export default (filepath1, filepath2, outputFormat = 'stylish') => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);
  const diff = buildTree(data1, data2);
  return format(outputFormat)(diff);
};
