const formatValue = (value) => {
  if (typeof value === 'object') return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const format = (diff, parent = '') => {
  const formatNodeOfType = {
    list: (node) => format(node.children, `${parent}${node.name}.`),
    unmodified: () => null,
    added: (node) => `Property '${parent}${node.name}' was added with value: ${formatValue(node.value)}`,
    removed: (node) => `Property '${parent}${node.name}' was removed`,
    modified: (node) => [`Property '${parent}${node.name}' was updated. `,
      `From ${formatValue(node.value)} to ${formatValue(node.value2)}`].join(''),
  };
  return diff.map((node) => formatNodeOfType[node.type](node))
    .filter((item) => item !== null)
    .join('\n');
};

export default format;
