function isJsonString(str) {
  if (typeof str !== 'string') return false;
  
  // Check if it's likely a JWT (starts with eyJ and contains two dots)
  if (str.startsWith('eyJ') && str.split('.').length === 3) {
    return true;
  }
  
  if (str === 'undefined') return false; // Handle the "undefined" string

  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    console.error('Invalid JSON string:', e.message);
    return false;
  }
}

export const localStorageHealthCheck = async () => {
  for (let i = 0; i < localStorage.length; ++i) {
    try {
      const key = localStorage.key(i);
      if (!key) continue; // Skip if key is null or undefined

      const result = window.localStorage.getItem(key);
      
      if (result === null || result === 'undefined') {
        // Remove item if it's null or "undefined"
        window.localStorage.removeItem(key);
      } else if (!isJsonString(result)) {
        // Remove item if it's not valid JSON
        window.localStorage.removeItem(key);
      } else if (result.trim() === '') {
        // Remove item if it's an empty string
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      window.localStorage.clear();
      console.error('window.localStorage Exception occurred:', error);
    }
  }
};

export const storePersist = {
  set: (key, state) => {
    try {
      if (state === undefined) {
        window.localStorage.removeItem(key); // Remove the item if the state is undefined
      } else {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  },
  get: (key) => {
    try {
      const result = window.localStorage.getItem(key);
      if (result === null || !isJsonString(result)) {
        return false;
      }
      return JSON.parse(result);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return false;
    }
  },
  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  },
  getAll: () => {
    try {
      const allItems = {};
      for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i);
        if (key) {
          allItems[key] = localStorage.getItem(key);
        }
      }
      return allItems;
    } catch (error) {
      console.error('Error getting all items from localStorage:', error);
      return {};
    }
  },
  clear: () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

export default storePersist;
