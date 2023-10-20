import { useEffect, useState } from 'react';

/**
 * 参数：value: input值
 * delay：推迟时间
 * @type {useDebounce}
 */
export function useDebounce<T>(value: T, delay: number = 1000): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounceValue;
};
