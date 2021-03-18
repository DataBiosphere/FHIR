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

    const compareFields = (field1, field2) => {
      console.log(JSON.stringify(field1));
      console.log(JSON.stringify(field2));
      if (field1.reference) {
        if (field1.reference <= field2.reference){
          return -1;
        }
        else
          return 1;
      } else if (field1.code) {
        if (field1.code <= field2.code)
          return -1;
        else
          return 1;
      } else {
        if (field1 <= field2)
          return -1;
        else
          return 1;
      }
    };

    let value = 0;
    sortByArray.forEach((sortObj) => {
      value = compareFields(a1[sortObj.field], a2[sortObj.field]) * sortObj.multiplier;
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

    for (let i = 0; i < positions.length; i += 1) {
      if (
        winningVal === null ||
        winningVal === undefined ||
        compareFn(arrays[i][positions[i]], winningVal) < 0
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
