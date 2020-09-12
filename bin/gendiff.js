#!/usr/bin/env node

import commander from 'commander';

const program = new commander.Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);
