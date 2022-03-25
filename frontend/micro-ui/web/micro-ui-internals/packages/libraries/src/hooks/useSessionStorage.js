import { useState } from "react";

const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const data = Digit.SessionStorage.get(key);
      return data ? data : initialValue;
    } catch (err) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      Digit.SessionStorage.set(key, valueToStore);
    } catch (err) {
    }
  };

  const clearValue = () => {
    setStoredValue(initialValue);
    Digit.SessionStorage.set(key, initialValue);
  };

  return [storedValue, setValue, clearValue];
};

export default useSessionStorage;
