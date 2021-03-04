const { bundleSize } = require('../config');
const { search } = require('../profiles/researchstudy');

const standardParameters = ['_page', '_count', '_id', '_include', '_source', '_hash', '_sort'];
const prefixModifiers = ['gt', 'lt', 'eq', 'ne', 'ge', 'le', 'sa', 'eb', 'ap'];
const stringModifiers = ['exact', 'contains'];
const uriModifiers = ['above', 'below'];
const tokenModifiers = ['text', 'not', 'above', 'below', 'in', 'not-in', 'of-type'];

const colonModifiers = [...stringModifiers, ...uriModifiers, ...tokenModifiers];

const getQueryStandardParameters = (query, { defaultSort }) => {
  const {
    _page = 1,
    _count = bundleSize,
    _id,
    _include,
    // _lastUpdated,
    // _profile,
    // _query,
    // _security,
    _source,
    // _tag,
    _hash = '',
    _sort = defaultSort,
  } = query;
  return { _page, _count, _id, _include, _source, _hash, _sort };
};

const getSearchParameters = (query) => {
  const clone = Object.assign({}, query);
  for (let k of standardParameters) {
    delete clone[k];
  }

  return clone;
}

module.exports = {
  standardParameters,
  getQueryStandardParameters,
  getSearchParameters,
  prefixModifiers,
  stringModifiers,
  uriModifiers,
  colonModifiers
}
