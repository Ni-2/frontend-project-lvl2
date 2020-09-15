/* eslint no-underscore-dangle: [2, {"allow": ["__filename", "__dirname"] }] */

import { fileURLToPath } from 'url';
import path from 'path';
import gendiff from '../src/gendiff-func.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('gendiff', () => {
  expect(gendiff(getFixturePath('file1.json'), getFixturePath('file2.json')))
    .toEqual('- follow: false\n  host: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true');
});
