const formattedValue = (value) => {
  if (typeof value === 'object') return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const formatter = (diff, parent = '') => diff.map((node) => {
  switch (node.type) {
    case 'list':
      return formatter(node.children, `${parent}${node.name}.`);
    case 'not changed':
      return null;
    case 'added':
      return `Property '${parent}${node.name}' was added with value: ${formattedValue(node.value)}`;
    case 'removed':
      return `Property '${parent}${node.name}' was removed`;
    case 'modified':
      return `Property '${parent}${node.name}' was updated. \
From ${formattedValue(node.value)} to ${formattedValue(node.value2)}`;
    default:
      throw new Error(`Unexpected node type: "${node.type}".`);
  }
})
  .filter((item) => item !== null)
  .join('\n');

export default formatter;
