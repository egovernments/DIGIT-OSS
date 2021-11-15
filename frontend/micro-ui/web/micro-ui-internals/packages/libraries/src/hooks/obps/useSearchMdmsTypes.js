import React from "react";
import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useSearchMdmsTypes = {
  applicationTypes: (tenantId) =>
    useQuery(
      [tenantId, "BPA_MDMS_APPLICATION_STATUS"],
      () =>
        MdmsService.getDataByCriteria(
          tenantId,
          {
            details: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "BPA",
                  masterDetails: [
                    {
                      name: "ApplicationType",
                    },
                  ],
                },
              ],
            },
          },
          "BPA"
        ),
      {
        select: (data) =>
          data.BPA.ApplicationType.map((type) => ({
            code: type.code,
            i18nKey: `WF_BPA_${type.code}`,
          })),
      }
    ),

    serviceTypes: (tenantId) =>
    useQuery(
      [tenantId, "BPA_MDMS_SERVICE_STATUS"],
      () =>
        MdmsService.getDataByCriteria(
          tenantId,
          {
            details: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "BPA",
                  masterDetails: [
                    {
                      name: "ServiceType",
                    },
                  ],
                },
              ],
            },
          },
          "BPA"
        ),
      {
        select: (data) =>
          data.BPA.ServiceType.map((type) => ({
            code: type.code,
            i18nKey: `BPA_SERVICETYPE_${type.code}`,
            applicationType: type.applicationType,
          })),
      }
    ),
};

export default useSearchMdmsTypes;