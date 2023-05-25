import React, { useEffect, useState } from "react";

const useComplaintSubType = (complaintType, t) => {
  const [subTypeMenu, setSubTypeMenu] = useState([]);

  useEffect(() => {
    (async () => {
      // console.log("find complaintType here", complaintType);
      if (complaintType) {
        const menu = await Digit.GetServiceDefinitions.getSubMenu(Digit.ULBService.getCurrentTenantId(), complaintType, t);
        setSubTypeMenu(menu);
      }
    })();
  }, [complaintType]);

  return subTypeMenu;
};

export default useComplaintSubType;
