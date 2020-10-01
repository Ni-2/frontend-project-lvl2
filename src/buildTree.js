import _ from 'lodash';

const genNode = (name, type, value, value2 = undefined) => ({
  name, type, value, value2,
});

const buildTree = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const sortedKeys = _.sortBy(keys);
  return sortedKeys.map((key) => {
    if (typeof data1[key] === 'object' && typeof data2[key] === 'object') {
      return { name: key, type: 'list', children: buildTree(data1[key], data2[key]) };
    }
    const items = [key];
    if (data1[key] === data2[key]) items.push('not changed', data2[key]);
    else if (!_.has(data1, key)) items.push('added', data2[key]);
    else if (!_.has(data2, key)) items.push('removed', data1[key]);
    else items.push('modified', data1[key], data2[key]);
    return genNode(...items);
  });
};

export default buildTree;
