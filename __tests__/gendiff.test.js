/* eslint no-underscore-dangle: [2, {"allow": ["__filename", "__dirname"] }] */

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import gendiff from '../src/gendiff-func.js';
import stylish from '../src/formatters/stylish.js';
import plain from '../src/formatters/plain.js';
import wrongDiff from '../__fixtures__/wrong-diff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
let expectedFlatDiff;
let expectedDeepDiff;
let expectedDiffPlain;
let expectedDiffJson;
let expectedFlatDiffPlain;
beforeAll(() => {
  expectedFlatDiff = fs.readFileSync(getFixturePath('expected-flat-diff.txt'), 'utf-8').trim();
  expectedDeepDiff = fs.readFileSync(getFixturePath('expected-deep-diff.txt'), 'utf-8').trim();
  expectedDiffPlain = fs.readFileSync(getFixturePath('expected-diff-plain.txt'), 'utf-8').trim();
  expectedDiffJson = fs.readFileSync(getFixturePath('expected-diff-json.json'), 'utf-8').trim();
  expectedFlatDiffPlain = fs.readFileSync(getFixturePath('expected-flat-diff-plain.txt'), 'utf-8').trim();
});

test.each([
  ['file1.json', 'file2.json'],
  ['file1.yaml', 'file2.yaml'],
  ['file1.ini', 'file2.ini'],
])('Compare of flat files', (file1, file2) => {
  expect(gendiff(getFixturePath(file1), getFixturePath(file2), 'stylish'))
    .toEqual(expectedFlatDiff);
});

test('Compare of ini flat files to plain format', () => {
  expect(gendiff(getFixturePath('file1.ini'), getFixturePath('file2.ini'), 'plain'))
    .toEqual(expectedFlatDiffPlain);
});

test('File of unknown type', () => {
  expect(() => gendiff(getFixturePath('file1'), getFixturePath('file2.yaml'), 'stylish'))
    .toThrow();
});

test('Deep compare to stylish format', () => {
  expect(gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'stylish'))
    .toEqual(expectedDeepDiff);
});

test.each([
  ['file3.json', 'file4.json'],
  ['file3.ini', 'file4.ini'],
])('Deep compare to plain format', (file1, file2) => {
  expect(gendiff(getFixturePath(file1), getFixturePath(file2), 'plain'))
    .toEqual(expectedDiffPlain);
});

test('Deep compare to json format', () => {
  expect(gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'json'))
    .toEqual(expectedDiffJson);
});

test('Unknown format', () => {
  expect(() => gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'wrongFormat'))
    .toThrow();
});

test.each([
  stylish,
  plain,
])('Testing formatters, when received node with wrong type', (format) => {
  expect(() => format(wrongDiff())).toThrow();
});
