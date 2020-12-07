/**
 *
 * @param {number} time in milliseconds
 * @param {*} ttl in milliseconds
 */
const isExpired = (time, ttl) => {
  return new Date().getTime() - time > ttl;
};

/**
 * a simple in memory cache implementation for use with fast-memoization
 * @param {number} ttl the number of milliseconds to hold memoized results for
 */
const createCache = (ttl) => {
  return {
    create() {
      const store = new Map();
      return {
        has(key) {
          return store.has(key) && !isExpired(store.get(key).time, ttl);
        },

        get(key) {
          const hit = store.get(key);
          if (hit && !isExpired(hit.time, ttl)) {
            return hit.value;
          }
          store.delete(key);
          return undefined;
        },

        set(key, value) {
          store.set(key, { value, time: new Date().getTime() });
        },
      };
    },
  };
};

module.exports = createCache;
