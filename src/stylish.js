const genStr = (key, value, depth) => {
  const valObj = () => Object.entries(value)
    .map(([k, v]) => genStr(k, v, depth + 2))
    .join(`\n${'  '.repeat(depth + 1)}`);

  const newValue = typeof value === 'object'
    ? `{
${'  '.repeat(depth)}  ${valObj()}
${'  '.repeat(depth - 1)}}`
    : value;
  return `${key}: ${newValue}`;
};

const formatter = (diff, depth = 1) => {
  const formattedDiff = Object.entries(diff).map(([key, value]) => {
    if (!Object.prototype.hasOwnProperty.call(value, 'hasGDChange')) {
      return `  ${key}: ${formatter(value, depth + 2)}`;
    }
    if (!value.hasGDChange) return `  ${genStr(key, value.value, depth)}`;
    const resItem = [];
    if (Object.prototype.hasOwnProperty.call(value, 'value1')) {
      resItem.push(`- ${genStr(key, value.value1, depth + 2)}`);
    }
    if (Object.prototype.hasOwnProperty.call(value, 'value2')) {
      resItem.push(`+ ${genStr(key, value.value2, depth + 2)}`);
    }
    return resItem.length === 2 ? resItem.join(`\n${'  '.repeat(depth)}`) : resItem[0];
  });
  return `{
${'  '.repeat(depth)}${formattedDiff.join(`\n${'  '.repeat(depth)}`)}
${'  '.repeat(depth - 1)}}`;
};

export default formatter;
