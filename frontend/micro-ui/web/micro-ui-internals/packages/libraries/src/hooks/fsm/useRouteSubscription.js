import React, { useEffect, useState } from "react";

const useRouteSubscription = (pathname) => {
  const [classname, setClassname] = useState("citizen");
  useEffect(() => {
    const isEmployeeUrl = Digit.Utils.detectDsoRoute(pathname);
    if (isEmployeeUrl && classname === "citizen") {
      setClassname("employee");
    } else if (!isEmployeeUrl && classname === "employee") {
      setClassname("citizen");
    }
  }, [pathname]);

  return classname;
};

export default useRouteSubscription;
