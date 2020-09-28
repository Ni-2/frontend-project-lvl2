const genStr = (value, depth) => {
  const valObj = () => Object.entries(value)
    .map(([k, v]) => `${'  '.repeat(depth + 1)}${k}: ${genStr(v, depth + 2)}`);

  return typeof value !== 'object' ? value
    : `${['{'].concat(valObj()).join('\n')}
${'  '.repeat(depth - 1)}}`;
};

const format = (diff, depth = 1) => {
  const nodes = diff.map((node) => {
    switch (node.type) {
      case 'list': return `  ${node.name}: ${format(node.children, depth + 2)}`;
      case 'added': return `+ ${node.name}: ${genStr(node.value, depth + 2)}`;
      case 'removed': return `- ${node.name}: ${genStr(node.value, depth + 2)}`;
      case 'modified': return `- ${node.name}: ${genStr(node.value1, depth + 2)}
${'  '.repeat(depth)}+ ${node.name}: ${genStr(node.value2, depth + 2)}`;
      case 'not changed': return `  ${node.name}: ${genStr(node.value, depth + 2)}`;
      default: throw new Error(`Unexpected node type: "${node.type}"!`);
    }
  });
  return `${['{'].concat(nodes).join(`\n${'  '.repeat(depth)}`)}
${'  '.repeat(depth - 1)}}`;
};

export default format;
