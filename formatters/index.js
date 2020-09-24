import stylish from './stylish.js';
import plain from './plain.js';

export default (name) => {
  switch (name) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    default:
      throw new Error('There is no such a formatter');
  }
};
