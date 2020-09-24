/* eslint no-underscore-dangle: [2, {"allow": ["__filename", "__dirname"] }] */

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import gendiff from '../src/gendiff-func.js';
import formatters from '../formatters/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
let expectedFlatDiff;
let expectedDeepDiff;
let expectedDiffPlain;
beforeAll(() => {
  expectedFlatDiff = fs.readFileSync(getFixturePath('expected-flat-diff.txt'), 'utf-8').trim();
  expectedDeepDiff = fs.readFileSync(getFixturePath('expected-deep-diff.txt'), 'utf-8').trim();
  expectedDiffPlain = fs.readFileSync(getFixturePath('expected-diff-plain.txt'), 'utf-8').trim();
});

test('genFlatDiff', () => {
  expect(formatters('stylish')(gendiff(getFixturePath('file1.json'), getFixturePath('file2.json'))))
    .toEqual(expectedFlatDiff);
  expect(formatters('stylish')(gendiff(getFixturePath('file1.yaml'), getFixturePath('file2.yaml'))))
    .toEqual(expectedFlatDiff);
  expect(formatters('stylish')(gendiff(getFixturePath('file1.ini'), getFixturePath('file2.ini'))))
    .toEqual(expectedFlatDiff);
  expect(() => formatters('stylish')(gendiff(getFixturePath('file1'), getFixturePath('file2.yaml'))))
    .toThrow();
});

test('genDeepDiff', () => {
  expect(formatters('stylish')(gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'))))
    .toEqual(expectedDeepDiff);
});

test('genDeepDiff with other formatters', () => {
  expect(formatters('plain')(gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'))))
    .toEqual(expectedDiffPlain);
  expect(() => formatters('notAddedFormatter')(gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'))))
    .toThrow();
});
