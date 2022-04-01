import { useEffect } from "react";

const useOnClickOutside = (ref, handler, isActive, eventParam = false) => {
  useEffect(() => {
    if (isActive) {
      document.addEventListener("click", handleClickOutSide, eventParam);
    } else {
      document.removeEventListener("click", handleClickOutSide, eventParam);
    }
    return () => {
      document.removeEventListener("click", handleClickOutSide, eventParam);
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
