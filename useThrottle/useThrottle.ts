import { useEffect, useRef, useState } from 'react';

/**
 * 参数：value: input值
 * wait：等候时间
 * @type {useDebounce}
 */
export function useThrottle<T>(value: T, wait: number = 1000): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  const timer = useRef(null);

  useEffect(() => {
    if (!timer.current) {
      timer.current = setTimeout(() => {
        setDebounceValue(value);
        timer.current = null;
      }, wait);
    }
  }, [ value, wait]);

  return debounceValue;
};
