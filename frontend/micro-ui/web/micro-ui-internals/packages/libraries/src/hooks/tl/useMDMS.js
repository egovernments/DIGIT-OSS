import React from "react";
import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useMDMS = {
  applicationTypes: (tenantId) =>
    useQuery(
      [tenantId, "TL_MDMS_APPLICATION_STATUS"],
      () =>
        MdmsService.getDataByCriteria(
          tenantId,
          {
            details: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "TradeLicense",
                  masterDetails: [
                    {
                      name: "ApplicationType",
                    },
                  ],
                },
              ],
            },
          },
          "TL"
        ),
      {
        select: (data) =>
          data.TradeLicense.ApplicationType.map((type) => ({
            code: type.code.split(".")[1],
            i18nKey: `TL_APPLICATIONTYPE.${type.code.split(".")[1]}`,
          })),
      }
    ),

  getFormConfig: (tenantId, config) =>
    useQuery(
      [tenantId, "FORM_CONFIG"],
      () =>
        MdmsService.getDataByCriteria(
          tenantId,
          {
            details: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "TradeLicense",
                  masterDetails: [
                    {
                      name: "CommonFieldsConfig",
                    },
                  ],
                },
              ],
            },
          },
          "TL"
        ),
      { select: (d) => d.TradeLicense.CommonFieldsConfig, ...config }
    ),
};

export default useMDMS;
