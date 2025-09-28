// Lightweight storage wrapper that uses AsyncStorage when available,
// and falls back to an in-memory Map during development.

let asyncStorage: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('@react-native-async-storage/async-storage');
  asyncStorage = mod?.default ?? mod;
} catch (e) {
  asyncStorage = null;
}

const memoryStore = new Map<string, string>();

export async function getItem(key: string): Promise<string | null> {
  if (asyncStorage && typeof asyncStorage.getItem === 'function') {
    return asyncStorage.getItem(key);
  }
  return memoryStore.has(key) ? (memoryStore.get(key) as string) : null;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (asyncStorage && typeof asyncStorage.setItem === 'function') {
    return asyncStorage.setItem(key, value);
  }
  memoryStore.set(key, value);
}

export async function removeItem(key: string): Promise<void> {
  if (asyncStorage && typeof asyncStorage.removeItem === 'function') {
    return asyncStorage.removeItem(key);
  }
  memoryStore.delete(key);
}


