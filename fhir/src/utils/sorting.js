const buildSortArray = (sort) => {
  return sort
    .split(',')
    .filter((str) => str)
    .map((str) => {
      const hasDash = str[0] === '-';
      return {
        field: hasDash ? str.substring(1) : str,
        multiplier: hasDash ? -1 : 1,
      };
    });
};

const buildCompareFn = (sort) => {
  const sortByArray = buildSortArray(sort);

  return (a1, a2) => {
    if (!a1) {
      return a2 ? -1 : 0;
    }

    if (!a2) {
      return 1;
    }

    let value = 0;
    sortByArray.forEach((sortObj) => {
      if (a1[sortObj.field] < a2[sortObj.field]) {
        value = -1 * sortObj.multiplier;
      }
      if (a1[sortObj.field] > a2[sortObj.field]) {
        value = 1 * sortObj.multiplier;
      }
    });

    return value;
  };
};

const mergeResults = (compareFn, limit, ...arrays) => {
  let count = 0;
  const positions = arrays.map((a) => 0);
  const result = [];

  while (count < limit) {
    let winningIdx = 0;
    let winningVal = arrays[winningIdx][positions[winningIdx]];

    for (let i = 1; i < positions.length; i += 1) {
      if (
        winningVal === null ||
        winningVal === undefined ||
        compareFn(winningVal, arrays[i][positions[i]]) > 0
      ) {
        winningIdx = i;
        winningVal = arrays[i][positions[i]];
      }
    }

    if (winningVal !== null && winningVal !== undefined) {
      result.push(arrays[winningIdx][positions[winningIdx]]);
      positions[winningIdx] += 1;
      count += 1;
    } else {
      break;
    }
  }

  return [result, positions];
};

module.exports = {
  buildSortArray,
  buildCompareFn,
  mergeResults,
};
