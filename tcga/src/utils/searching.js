const standardQueryParameters = ['_count', '_sort', '_offset', '_hash', '_include', '_revinclude', '_page', '_source'];
const prefixModifiers = ['gt', 'lt', 'eq', 'ne', 'ge', 'le', 'sa', 'eb', 'ap'];
const stringModifiers = ['exact', 'contains'];
const uriModifiers = ['above', 'below'];
const tokenModifiers = ['text', 'not', 'above', 'below', 'in', 'not-in', 'of-type'];
const referenceModifiers = ['identifier'];

const getSearchParameters = (query) => {
  const clone = Object.assign({}, query);
  for (let k of standardQueryParameters) {
    delete clone[k];
  }

  return clone;
}

module.exports = {
  standardQueryParameters,
  prefixModifiers,
  stringModifiers,
  uriModifiers,
  tokenModifiers,
  getSearchParameters
}
