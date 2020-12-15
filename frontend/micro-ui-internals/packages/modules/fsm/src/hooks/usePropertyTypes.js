import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const usePropertyTypes = ({ stateCode }) => {
  const [propertyType, setPropertyTypes] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const res = await Digit.MDMSService.getServiceDefs(stateCode, "PropertyTax");
      console.log("%c 🆒: usePropertyTypes -> res ", "font-size:16px;background-color:#5df5fc;color:black;", res);
      let menu = res.filter((o) => o.key !== "");
      menu.push({ key: "Others", name: "Others" });
      setPropertyTypes(menu);
    })();
  }, [stateCode]);

  return propertyType;
};

export default usePropertyTypes;
