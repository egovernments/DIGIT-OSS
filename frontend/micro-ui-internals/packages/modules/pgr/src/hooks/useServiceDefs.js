import { useTranslation } from "react-i18next";

const { useState, useEffect } = require("react");
const { useSelector } = require("react-redux");

const useServiceDefs = () => {
  const { common } = useSelector((state) => state);
  const [localMenu, setLocalMenu] = useState([]);
  const SessionStorage = Digit.SessionStorage;
  let { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const criteria = {
        type: "serviceDefs",
        details: {
          tenantId: common.stateInfo.code,
          moduleDetails: [
            {
              moduleName: "RAINMAKER-PGR",
              masterDetails: [
                {
                  name: "ServiceDefs",
                },
              ],
            },
          ],
        },
      };

      const serviceDefs = await Digit.MDMSService.getDataByCriteria(criteria);
      SessionStorage.set("serviceDefs", serviceDefs);
      // var __localMenu__ = [];
      // await Promise.all(
      //   serviceDefs.map((def) => {
      //     if (!__localMenu__.find((e) => e.key === def.menuPath)) {
      //       def.menuPath === ""
      //         ? __localMenu__.push({ code: "SERVICEDEFS.OTHERS", name: t("SERVICEDEFS.OTHERS") })
      //         : __localMenu__.push({ code: "SERVICEDEFS." + def.menuPath.toUpperCase(), name: t(def.menuPath.toUpperCase()) });
      //     }
      //   })
      // );
      const serviceDefsWithKeys = serviceDefs.map((def) => ({ ...def, i18nKey: t("SERVICEDEFS." + def.serviceCode.toUpperCase()) }));
      console.log("serviceDefs:", serviceDefsWithKeys);
      setLocalMenu(serviceDefsWithKeys);
    })();
  }, [common]);

  return localMenu;
};

export default useServiceDefs;
