import _ from 'lodash';

const formatter = (diff, depth = 1) => {
  const genStr = (key, value, d = depth) => {
    return `${key}: ${typeof value === 'object'
      ? `{\n${'  '.repeat(d)}  ${Object.entries(value).map(([k, v]) => genStr(k, v, d + 2)).join(`\n${'  '.repeat(d + 1)}`)}\n${'  '.repeat(d - 1)}}`
      : value}`;
  };

  const formattedDiff = Object.entries(diff).map(([key, value]) => {
    if (!_.has(value, 'hasGDChange')) {
      return `  ${key}: ${formatter(value, depth + 2)}`;
    }
    if (!value.hasGDChange) {
      return `  ${genStr(key, value.value)}`;
    }
    const a = value.value1 !== undefined ? `- ${genStr(key, value.value1, depth + 2)}` : undefined;
    const b = value.value2 !== undefined ? `+ ${genStr(key, value.value2, depth + 2)}` : undefined;
    return _.compact([a, b]).join(`\n${'  '.repeat(depth)}`);
  });
  return `{\n${'  '.repeat(depth)}${formattedDiff.join(`\n${'  '.repeat(depth)}`)}\n${'  '.repeat(depth - 1)}}`;
};

export default formatter;
