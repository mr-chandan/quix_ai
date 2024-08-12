import { useCallback, useRef } from "react";

function useDebounce(callback: Function, delay: number) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

export default useDebounce;
