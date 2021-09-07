import React, { useEffect, useRef } from "react";

function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const timer = setInterval(tick, delay);
      return () => clearInterval(timer);
    }
  }, [delay]);
}

export default useInterval;
