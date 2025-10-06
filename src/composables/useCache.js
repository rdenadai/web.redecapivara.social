// A simple cache using pinia's reactivity system
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCache = defineStore("cache", () => {
  const cache = ref({});

  function set(key, value) {
    cache.value[key] = value;
  }

  function get(key) {
    return cache.value[key];
  }

  function remove(key) {
    delete cache.value[key];
  }

  function clear() {
    cache.value = {};
  }

  return { set, get, remove, clear };
});
