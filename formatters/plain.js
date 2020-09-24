const formatter = (diff, parent = '') => {
  const formattedValue = (value) => {
    if (typeof value === 'object') return '[complex value]';
    if (typeof value === 'string') return `'${value}'`;
    return value;
  };
  const formattedDiff = Object.entries(diff)
    .map(([key, value]) => {
      if (!Object.prototype.hasOwnProperty.call(value, 'hasGDChange')) {
        return formatter(value, `${parent}${key}.`);
      }
      if (!value.hasGDChange) return null;
      if (!Object.prototype.hasOwnProperty.call(value, 'value1')) {
        return `Property '${parent}${key}' was added with value: ${formattedValue(value.value2)}`;
      }
      if (!Object.prototype.hasOwnProperty.call(value, 'value2')) {
        return `Property '${parent}${key}' was removed`;
      }
      return `Property '${parent}${key}' was updated. \
From ${formattedValue(value.value1)} to ${formattedValue(value.value2)}`;
    })
    .filter((item) => item !== null)
    .join('\n');
  return formattedDiff;
};

export default formatter;
