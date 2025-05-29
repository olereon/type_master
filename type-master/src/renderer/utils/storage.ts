// Storage abstraction that works in both Electron and browser environments

export const storage = {
  async get(key: string): Promise<any> {
    if (window.electronAPI) {
      return window.electronAPI.store.get(key);
    }
    // Fallback to localStorage for browser
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  async set(key: string, value: any): Promise<void> {
    if (window.electronAPI) {
      return window.electronAPI.store.set(key, value);
    }
    // Fallback to localStorage for browser
    localStorage.setItem(key, JSON.stringify(value));
  },

  async delete(key: string): Promise<void> {
    if (window.electronAPI) {
      return window.electronAPI.store.delete(key);
    }
    // Fallback to localStorage for browser
    localStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    if (window.electronAPI) {
      return window.electronAPI.store.clear();
    }
    // Fallback to localStorage for browser
    localStorage.clear();
  },
};