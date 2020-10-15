import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
let expectedDiffStylish;
let expectedDiffPlain;
let expectedDiffJson;
beforeAll(() => {
  expectedDiffStylish = fs.readFileSync(getFixturePath('expected-diff-stylish.txt'), 'utf-8').trim();
  expectedDiffPlain = fs.readFileSync(getFixturePath('expected-diff-plain.txt'), 'utf-8').trim();
  expectedDiffJson = fs.readFileSync(getFixturePath('expected-diff-json.json'), 'utf-8').trim();
});

test.each([
  ['file1.json', 'file2.json'],
  ['file1.ini', 'file2.ini'],
  ['file1.yml', 'file2.yaml'],
])('Deep compare', (file1, file2) => {
  expect(gendiff(getFixturePath(file1), getFixturePath(file2)))
    .toEqual(expectedDiffStylish);
  expect(gendiff(getFixturePath(file1), getFixturePath(file2), 'stylish'))
    .toEqual(expectedDiffStylish);
  expect(gendiff(getFixturePath(file1), getFixturePath(file2), 'plain'))
    .toEqual(expectedDiffPlain);
  expect(gendiff(getFixturePath(file1), getFixturePath(file2), 'json'))
    .toEqual(expectedDiffJson);
});

test('File of unknown type', () => {
  expect(() => gendiff(getFixturePath('file1.undef'), getFixturePath('file2.yaml'), 'stylish'))
    .toThrow();
});

test('Unknown format', () => {
  expect(() => gendiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'wrongFormat'))
    .toThrow();
});
