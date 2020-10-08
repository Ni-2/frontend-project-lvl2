const genSeparator = (indentsCount) => '  '.repeat(indentsCount);

const unitNodes = (nodes, indentsCount) => (
  ['{', ...nodes, `${genSeparator(indentsCount - 1)}}`].join('\n')
);

const changeIndicator = {
  added: '+ ',
  removed: '- ',
  unmodified: '  ',
  list: '  ',
};

const makeLeftPart = (name, type, indentsCount) => [
  genSeparator(indentsCount),
  changeIndicator[type],
  name,
  ': ',
].join('');

const formatValue = (value, indentsCount) => {
  if (typeof value !== 'object') return value;
  const formattedValues = Object.entries(value)
    .map(([childName, childValue]) => [
      makeLeftPart(childName, 'unmodified', indentsCount),
      formatValue(childValue, indentsCount + 2),
    ].join(''));
  return unitNodes(formattedValues, indentsCount);
};

const format = (diff, indentsCount) => {
  const formatNode = (name, type, value, children) => {
    const leftPart = makeLeftPart(name, type, indentsCount);
    if (type === 'list') return [leftPart, format(children, indentsCount + 2)].join('');
    return [leftPart, formatValue(value, indentsCount + 2)].join('');
  };

  const nodes = diff.map((node) => (node.type === 'modified'
    ? [formatNode(node.name, 'removed', node.value),
      formatNode(node.name, 'added', node.value2)].join('\n')
    : formatNode(node.name, node.type, node.value, node.children)));
  return unitNodes(nodes, indentsCount);
};

export default (diff) => format(diff, 1);
