import { useEffect } from "react";

const useOnClickOutside = (ref, handler, isActive) => {
  useEffect(() => {
    if (isActive) {
      document.addEventListener("click", handleClickOutSide, false);
    } else {
      document.removeEventListener("click", handleClickOutSide, false);
    }
    return () => {
      // console.log("removeEventListener event fired:::::>", event);
      document.removeEventListener("click", handleClickOutSide, false);
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
