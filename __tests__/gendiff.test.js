/* eslint no-underscore-dangle: [2, {"allow": ["__filename", "__dirname"] }] */

import { fileURLToPath } from 'url';
import path from 'path';
import gendiff from '../src/gendiff-func.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const expectedDiff = `- follow: false
  host: hexlet.io
- proxy: 123.234.53.22
- timeout: 50
+ timeout: 20
+ verbose: true`;

test('gendiff', () => {
  expect(gendiff(getFixturePath('file1.json'), getFixturePath('file2.json')))
    .toEqual(expectedDiff);
  expect(gendiff(getFixturePath('file1.yaml'), getFixturePath('file2.yaml')))
    .toEqual(expectedDiff);
  expect(gendiff(getFixturePath('file1.ini'), getFixturePath('file2.ini')))
    .toEqual(expectedDiff);
  expect(() => gendiff(getFixturePath('file1'), getFixturePath('file2.yaml')))
    .toThrow();
});
