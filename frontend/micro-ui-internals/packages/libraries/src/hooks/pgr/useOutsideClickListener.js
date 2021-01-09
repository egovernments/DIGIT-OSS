import React, { useState, useEffect } from "react";

const useOutsideClickListener = (ref) => {
  const [clickedOutside, setClickedOutside] = useState(false);
  useEffect(() => {
    const handleClickedOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setClickedOutside(true);
      } else {
        setClickedOutside(false);
      }
    };
    document.addEventListener("mousedown", handleClickedOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickedOutside);
    };
  }, [ref]);
  return clickedOutside;
};

export default useOutsideClickListener;
