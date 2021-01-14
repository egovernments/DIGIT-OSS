import { useEffect } from "react";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    console.log("useOnClickOutside event fired:::::>", event, ref, handler);
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      console.log("listener event fired:::::>", event);
      handler(event);
    };
    console.log("adding event fired:::::>", event);
    document.addEventListener("mouseup", listener);
    // debugger
    return () => {
      console.log("removeEventListener event fired:::::>", event);
      document.removeEventListener("mouseup", listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
