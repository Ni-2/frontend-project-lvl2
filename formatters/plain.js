const formattedValue = (value) => {
  if (typeof value === 'object') return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const formatter = (diff, parent = '') => diff.map((node) => {
  if (node.type === 'list') {
    return formatter(node.children, `${parent}${node.name}.`);
  }
  if (node.type === 'not changed') return null;
  if (node.type === 'added') {
    return `Property '${parent}${node.name}' was added with value: ${formattedValue(node.value)}`;
  }
  if (node.type === 'removed') {
    return `Property '${parent}${node.name}' was removed`;
  }
  return `Property '${parent}${node.name}' was updated. \
From ${formattedValue(node.value)} to ${formattedValue(node.value2)}`;
})
  .filter((item) => item !== null)
  .join('\n');

export default formatter;
