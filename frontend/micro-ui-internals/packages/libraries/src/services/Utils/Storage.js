const localStoreSupport = () => {
  try {
    return "sessionStorage" in window && window["sessionStorage"] !== null;
  } catch (e) {
    return false;
  }
};
const storageClass = window.sessionStorage;
const k = (key) => `Digit.${key}`;
export const Storage = {
  get: (key) => {
    if (localStoreSupport() && key) {
      let valueInStorage = storageClass.getItem(k(key));
      return valueInStorage && valueInStorage !== "undefined" ? JSON.parse(valueInStorage) : null;
    } else if (typeof window !== "undefined") {
      return window && window.eGov && window.eGov.Storage && window.eGov.Storage[k(key)];
    } else {
      return null;
    }
  },
  set: (key, value) => {
    if (localStoreSupport()) {
      storageClass.setItem(k(key), JSON.stringify(value));
    } else if (typeof window !== "undefined") {
      window.eGov = window.eGov || {};
      window.eGov.Storage = window.eGov.Storage || {};
      window.eGov.Storage[k(key)] = value;
    }
  },
  del: (key) => {
    if (localStoreSupport()) {
      storageClass.removeItem(k(key));
    } else if (typeof window !== "undefined") {
      window.eGov = window.eGov || {};
      window.eGov.Storage = window.eGov.Storage || {};
      delete window.eGov.Storage[k(key)];
    }
  },
};
