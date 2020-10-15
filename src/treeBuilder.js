import _ from 'lodash';

const genNode = (name, type, value, value2) => ({
  name, type, value, value2,
});

const buildTree = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const sortedKeys = _.sortBy(keys);
  return sortedKeys.map((key) => {
    if (!_.has(data1, key)) {
      return genNode(key, 'added', data2[key]);
    }
    if (!_.has(data2, key)) {
      return genNode(key, 'removed', data1[key]);
    }
    if (typeof data1[key] === 'object' && data1[key] !== null
      && typeof data2[key] === 'object' && data2[key] !== null) {
      return { name: key, type: 'list', children: buildTree(data1[key], data2[key]) };
    }
    if (data1[key] === data2[key]) {
      return genNode(key, 'unmodified', data2[key]);
    }
    return genNode(key, 'modified', data1[key], data2[key]);
  });
};

export default buildTree;
