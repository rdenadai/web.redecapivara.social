// A simple cache using localStorage via VueUse
import { useSessionStorage } from "@vueuse/core";

export const useCache = () => {
  const cache = useSessionStorage("capivara_cache", {});

  function set(key, value, invalidate = true) {
    if (invalidate) {
      value._timestamp = Date.now();
    }
    cache.value[key] = JSON.stringify(value || {});
  }

  function get(key) {
    return JSON.parse(cache.value[key] || "{}");
  }

  function has(key) {
    return key in cache.value;
  }

  function remove(key) {
    delete cache.value[key];
  }

  function clear() {
    cache.value = {};
  }

  // Invalidate cache entries older than 10 minutes
  const now = Date.now();
  for (const key in cache.value) {
    try {
      const entry = JSON.parse(cache.value[key]);
      if (entry._timestamp && now - entry._timestamp > 10 * 60 * 1000) {
        remove(key);
      }
    } catch (e) {
      console.error("Error parsing cache entry", key, e);
      remove(key);
    }
  }

  return { set, get, has, remove, clear };
};
