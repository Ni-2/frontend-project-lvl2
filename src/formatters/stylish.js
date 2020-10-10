const formatValue = (value, indentsCount) => {
  if (typeof value !== 'object') return value;
  const formattedValues = Object.entries(value).map(([childName, childValue]) => (
    `${'  '.repeat(indentsCount)}  ${childName}: ${formatValue(childValue, indentsCount + 2)}`
  ));
  return `{\n${formattedValues.join('\n')}\n${'  '.repeat(indentsCount - 1)}}`;
};

const format = (diff, indentsCount) => {
  const formatNodeByType = {
    added: (node) => (
      `${'  '.repeat(indentsCount)}+ ${node.name}: ${formatValue(node.value, indentsCount + 2)}`
    ),
    removed: (node) => (
      `${'  '.repeat(indentsCount)}- ${node.name}: ${formatValue(node.value, indentsCount + 2)}`
    ),
    unmodified: (node) => (
      `${'  '.repeat(indentsCount)}  ${node.name}: ${formatValue(node.value, indentsCount + 2)}`
    ),
    modified: (node) => [
      `${'  '.repeat(indentsCount)}- ${node.name}: ${formatValue(node.value, indentsCount + 2)}`,
      `${'  '.repeat(indentsCount)}+ ${node.name}: ${formatValue(node.value2, indentsCount + 2)}`,
    ].join('\n'),
    list: (node) => (
      `${'  '.repeat(indentsCount)}  ${node.name}: ${format(node.children, indentsCount + 2)}`
    ),
  };
  const nodes = diff.map((node) => formatNodeByType[node.type](node));
  return `{\n${nodes.join('\n')}\n${'  '.repeat(indentsCount - 1)}}`;
};

export default (diff) => format(diff, 1);
