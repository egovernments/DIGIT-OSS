import { useEffect } from "react";

const useOnClickOutside = (ref, handler, isActive) => {
  useEffect(() => {
    if (isActive) {
      document.addEventListener("click", handleClickOutSide, { capture: true });
    } else {
      document.removeEventListener("click", handleClickOutSide,  { capture: true });
    }
    return () => {
      document.removeEventListener("click", handleClickOutSide,  { capture: true });
    };
  }, [isActive]);

  const handleClickOutSide = (event) => {
    if (ref.current && ref.current.contains(event.target)) {
      return;
    }
    handler(event);
  }
};

export default useOnClickOutside;
