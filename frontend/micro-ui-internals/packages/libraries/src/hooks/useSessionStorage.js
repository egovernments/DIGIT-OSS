import { useState } from "react";

const useSessionStorage = (key, initalValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const data = Digit.SessionStorage.get(key);
      return data ? data : initalValue;
    } catch (err) {
      return initalValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      Digit.SessionStorage.set(key, valueToStore);
    } catch (err) {
      console.log(err);
    }
  };

  const clearValue = () => {
    setStoredValue(initalValue);
    Digit.SessionStorage.set(key, null);
  };

  return [storedValue, setValue, clearValue];
};

export default useSessionStorage;
