#!/usr/bin/env node

import commander from 'commander';
import diff from '../src/gendiff-func.js';
import stylish from '../src/stylish.js';

const program = new commander.Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2) => {
    if (program.format === 'stylish') console.log(stylish(diff(filepath1, filepath2)));
  })
  .helpOption('-h, --help', 'output usage information');

program.parse(process.argv);
