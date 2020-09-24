#!/usr/bin/env node

import commander from 'commander';
import diff from '../src/gendiff-func.js';
import formatters from '../formatters/index.js';

const program = new commander.Command();

export default (filepath1, filepath2, format = 'stylish') => (
  formatters(format)(diff(filepath1, filepath2))
);

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => (
    console.log(formatters(program.format)(diff(filepath1, filepath2)))
  ))
  .helpOption('-h, --help', 'output usage information');

program.parse(process.argv);
