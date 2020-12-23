import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getServiceDefinitions } from "../Services/ServiceDefinitions";

const useComplaintTypes = ({ stateCode }) => {
  const [complaintTypes, setComplaintTypes] = useState(null);
  const { t } = useTranslation();

  const serviceDefinitions = getServiceDefinitions();
  useEffect(() => {
    (async () => {
      const res = await serviceDefinitions.getMenu(stateCode, t);
      let menu = res.filter((o) => o.key !== "");
      menu.push({ key: "Others", name: "Others" });
      setComplaintTypes(menu);
    })();
  }, [stateCode]);

  return complaintTypes;
};

export default useComplaintTypes;
