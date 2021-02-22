/**
 * Transform a row from the TCGA query into sub objects of their original tables
 *
 * @param {row} row
 */
const transformAnvilResults = (row) => ({
  // TODO: this is where we tranform the rows into something readable
  //       it should return the same thing as when we make calls to `/api/gdc`
});

/**
 *
 * @param list {Array} - List of objects to dedupe
 * @returns {Array}
 */
function dedupeObjects(list) {
  const compareObjects = (a, b) => {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return true;
    }

    /* eslint-disable no-restricted-syntax */
    for (const key in a) {
      if (a[key] !== b[key]) return true;
    }
    return false;
  };

  return list.filter((search, index) => {
    /* eslint-disable no-plusplus */
    for (let i = 0; i < index; i++) {
      if (!compareObjects(search, list[i])) return false;
    }
    return true;
  });
}

const buildSortObject = (sort) => {
  let sortObj = {};
  let existsObj = {};

  sort.split(',').filter((str) => str).forEach((str) => {
      const field = str[0] === '-' ? str.substring(1) : str;
      sortObj[field] = str[0] === '-' ? -1 : 1;

      existsObj[field] = buildExistsProp(field);
  });

  return [sortObj, existsObj];
};

const buildExistsProp = (prop) => {
  return {
    $exists: true
  };
};

module.exports = {
  dedupeObjects,
  buildSortObject
};
