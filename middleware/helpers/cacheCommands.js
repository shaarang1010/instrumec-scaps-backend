const NodeCache = require("node-cache");
const myCache = new NodeCache();

const setToCache = (key, value) => {
  return myCache.set(key, value, 0);
};

const getFromCache = (key) => {
  return myCache.get(key);
};

module.exports = { setToCache, getFromCache };
