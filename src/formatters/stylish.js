const formatValue = (value, indentsCount) => {
  if (typeof value !== 'object' || value === null) return value;
  const formattedValues = Object.entries(value).map(([childName, childValue]) => (
    `${'  '.repeat(indentsCount)}  ${childName}: ${formatValue(childValue, indentsCount + 2)}`
      .trimRight()
  ));
  return `{\n${formattedValues.join('\n')}\n${'  '.repeat(indentsCount - 1)}}`;
};

const formatNode = (name, value, symbol, indentsCount) => (
  `${'  '.repeat(indentsCount)}${symbol} ${name}: ${formatValue(value, indentsCount + 2)}`
    .trimRight()
);

const format = (diff, indentsCount) => {
  const formatNodeByType = {
    added: (node) => formatNode(node.name, node.value, '+', indentsCount),
    removed: (node) => formatNode(node.name, node.value, '-', indentsCount),
    unmodified: (node) => formatNode(node.name, node.value, ' ', indentsCount),
    modified: (node) => [formatNode(node.name, node.value, '-', indentsCount),
      formatNode(node.name, node.value2, '+', indentsCount)],
    list: (node) => (
      `${'  '.repeat(indentsCount)}  ${node.name}: ${format(node.children, indentsCount + 2)}`
    ),
  };
  const nodes = diff.flatMap((node) => formatNodeByType[node.type](node));
  return `{\n${nodes.join('\n')}\n${'  '.repeat(indentsCount - 1)}}`;
};

export default (diff) => format(diff, 1);
