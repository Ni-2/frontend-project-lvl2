const unitNodes = (nodes, indentsCount) => [
  '{', ...nodes, `${'  '.repeat(indentsCount - 1)}}`,
].join('\n');

const changeIndicator = {
  added: '+ ',
  removed: '- ',
  unmodified: '  ',
  list: '  ',
};

const formatValue = (value, indentsCount) => {
  if (typeof value !== 'object') return value;
  const formattedValues = Object.entries(value)
    .map(([childName, childValue]) => [
      '  '.repeat(indentsCount + 1),
      childName,
      ': ',
      formatValue(childValue, indentsCount + 2),
    ].join(''));
  return unitNodes(formattedValues, indentsCount);
};

const format = (diff, indentsCount) => {
  const formatNode = (name, type, value, children) => [
    '  '.repeat(indentsCount),
    changeIndicator[type],
    name,
    ': ',
    type === 'list' ? format(children, indentsCount + 2)
      : formatValue(value, indentsCount + 2),
  ].join('');

  const nodes = diff.map((node) => (node.type === 'modified'
    ? [formatNode(node.name, 'removed', node.value),
      formatNode(node.name, 'added', node.value2)].join('\n')
    : formatNode(node.name, node.type, node.value, node.children)));
  return unitNodes(nodes, indentsCount);
};

export default (diff) => format(diff, 1);
