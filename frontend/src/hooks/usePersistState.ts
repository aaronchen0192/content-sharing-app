import React from 'react';

const usePersistState = <T>(
  storageKey: string,
  defaultState: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState<T>(() => {
    // retrieve from local storage
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue) as T;
      if (parsedValue !== defaultState) {
        return parsedValue;
      }
    }
    return defaultState;
  });

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  return [state, setState];
};

export default usePersistState;
