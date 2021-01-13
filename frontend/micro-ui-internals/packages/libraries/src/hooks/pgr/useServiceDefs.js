import { useTranslation } from "react-i18next";

const { useState, useEffect } = require("react");

const useServiceDefs = (tenantId, moduleCode) => {
  const [localMenu, setLocalMenu] = useState([]);
  const SessionStorage = Digit.SessionStorage;
  let { t } = useTranslation();

  useEffect(async () => {
    const serviceDefs = await Digit.MDMSService.getServiceDefs(tenantId, moduleCode);
    SessionStorage.set("serviceDefs", serviceDefs);

    const serviceDefsWithKeys = serviceDefs.map((def) => ({ ...def, i18nKey: t("SERVICEDEFS." + def.serviceCode.toUpperCase()) }));
    console.log("serviceDefs:", serviceDefsWithKeys);
    setLocalMenu(serviceDefsWithKeys);
  }, []);

  return localMenu;
};

export default useServiceDefs;
