import React from "react";
import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useWSMDMSWS = {
  applicationTypes: (tenantId) =>
    useQuery(
      [tenantId, "WS_WS_SERVICES_MASTERS"],
      () =>
        MdmsService.getDataByCriteria(
          tenantId,
          {
            details: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "ws-services-masters",
                  masterDetails: [
                    {
                      name: "ApplicationType",
                    },
                  ],
                },
              ],
            },
          },
          "ws-services-masters"
        ),
      {
        select: (data) =>
          data['ws-services-masters'].ApplicationType.map((type) => ({
            code: type.code,
            i18nKey: `WS_${type.code}`,
          })),
      }
    ),

};

export default useWSMDMSWS;
