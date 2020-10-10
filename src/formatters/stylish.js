const formatValue = (value, indentsCount) => {
  if (typeof value !== 'object') return value;
  const formattedValues = Object.entries(value).map(([childName, childValue]) => (
    `${'  '.repeat(indentsCount)}  ${childName}: ${formatValue(childValue, indentsCount + 2)}`
  ));
  return `{\n${formattedValues.join('\n')}\n${'  '.repeat(indentsCount - 1)}}`;
};

const format = (diff, indentsCount) => {
  const formatNode = (name, value, symbol) => (
    `${'  '.repeat(indentsCount)}${symbol} ${name}: ${formatValue(value, indentsCount + 2)}`
  );

  const formatNodeByType = {
    added: (node) => formatNode(node.name, node.value, '+'),
    removed: (node) => formatNode(node.name, node.value, '-'),
    unmodified: (node) => formatNode(node.name, node.value, ' '),
    modified: (node) => [formatNode(node.name, node.value, '-'),
      formatNode(node.name, node.value2, '+')].join('\n'),
    list: (node) => (
      `${'  '.repeat(indentsCount)}  ${node.name}: ${format(node.children, indentsCount + 2)}`
    ),
  };
  const nodes = diff.map((node) => formatNodeByType[node.type](node));
  return `{\n${nodes.join('\n')}\n${'  '.repeat(indentsCount - 1)}}`;
};

export default (diff) => format(diff, 1);
