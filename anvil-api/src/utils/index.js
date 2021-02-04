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

module.exports = {
  dedupeObjects,
};
