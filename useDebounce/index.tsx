import {useEffect, useMemo, useRef, useState} from "react";

interface DebounceHelpers {
  loading: boolean,
}

/**
 * 参数：value: input值
 * delay：推迟时间
 * @type {useDebounce}
 */
const useDebounce = (value: string, delay: number = 1000): [string, DebounceHelpers] => {
  const [state, setState] = useState<string>(value)
  const [loading, setLoading] = useState<boolean>(false)
  const initializeRef = useRef<boolean>(false)

  useEffect(() => {
    if (initializeRef.current) {
      setLoading(true)
    } else {
      initializeRef.current = true
    }
    let timer = setTimeout(() => {
      setState(value)
      setLoading(false)
    }, delay);
    return () => clearTimeout(timer)
  }, [value, delay])

  return useMemo(() => {
    return [
      state,
      {
        loading,
      }
    ]
  }, [loading])
}
export default useDebounce;
