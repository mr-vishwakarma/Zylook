const STORAGE_PREFIX = 'zylook_';

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key, value) => {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  },

  remove: (key) => {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  clear: () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },
};

export default storage;
