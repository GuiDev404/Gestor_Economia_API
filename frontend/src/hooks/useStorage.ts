import { useState } from "react"

function useStorage <T>(key: string, defaultValue?: T) {
  const [ storage, setStorage ] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;

    } catch (error) {
      return defaultValue;
    }
  });
  
  const addData = (data: T) => {
    try {
      setStorage(data)
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }

  const removeItem = () => {
    localStorage.removeItem(key);
    setStorage(null)
  }

  return { storage, addData, removeItem  }
}

export default useStorage