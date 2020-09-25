import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

export default (name) => {
  switch (name) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    case 'json':
      return json;
    default:
      throw new Error('There is no such a formatter');
  }
};
