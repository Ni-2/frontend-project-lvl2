#!/usr/bin/env node

import commander from 'commander';
import genDiff from '../src/gendiff.js';

const program = new commander.Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => (
    console.log(genDiff(filepath1, filepath2, program.format))
  ))
  .helpOption('-h, --help', 'output usage information');

program.parse(process.argv);
