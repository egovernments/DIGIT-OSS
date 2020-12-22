import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getServiceDefinitions } from "../Services/ServiceDefinitions";

const useComplaintTypes = ({ stateCode }) => {
  const [complaintTypes, setComplaintTypes] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const res = await getServiceDefinitions.getMenu(stateCode, t);
      let menu = res.filter((o) => o.key !== "");
      menu.push({ key: "Others", name: "Others" });
      setComplaintTypes(menu);
    })();
  }, [stateCode]);

  return complaintTypes;
};

export default useComplaintTypes;
