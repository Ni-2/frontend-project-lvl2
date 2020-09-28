/* eslint no-underscore-dangle: [2, {"allow": ["__filename", "__dirname"] }] */

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import gendiff from '../src/gendiff-func.js';
import stylish from '../formatters/stylish.js';
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

test('genFlatDiff', () => {
  expect(gendiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'stylish'))
    .toEqual(expectedFlatDiff);
  expect(gendiff(getFixturePath('file1.yaml'), getFixturePath('file2.yaml'), 'stylish'))
    .toEqual(expectedFlatDiff);
  expect(gendiff(getFixturePath('file1.ini'), getFixturePath('file2.ini'), 'stylish'))
    .toEqual(expectedFlatDiff);
  expect(() => gendiff(getFixturePath('file1'), getFixturePath('file2.yaml'), 'stylish'))
    .toThrow();
});

test('genDeepDiff', () => {
  expect(gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'stylish'))
    .toEqual(expectedDeepDiff);
});

test('genDeepDiff with other formatters', () => {
  expect(gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'plain'))
    .toEqual(expectedDiffPlain);
  expect(gendiff(getFixturePath('file3.ini'), getFixturePath('file4.ini'), 'plain'))
    .toEqual(expectedDiffPlain);
  expect(gendiff(getFixturePath('file1.ini'), getFixturePath('file2.ini'), 'plain'))
    .toEqual(expectedFlatDiffPlain);
  expect(gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'json'))
    .toEqual(expectedDiffJson);
  expect(() => gendiff(getFixturePath('file3.json'), getFixturePath('file4.json'), 'notAddedFormat'))
    .toThrow();
});

test('Testing Stylish formatter, when received node with wrong type', () => {
  expect(() => stylish(wrongDiff())).toThrow();
});
