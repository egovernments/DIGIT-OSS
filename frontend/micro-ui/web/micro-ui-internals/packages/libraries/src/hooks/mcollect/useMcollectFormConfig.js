import React from "react";
import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useMcollectFormConfig = {

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
                  moduleName: "mCollect",
                  masterDetails: [
                    {
                      name: "CreateFieldsConfig",
                    },
                  ],
                },
              ],
            },
          },
          "mCollect"
        ),
      { select: (d) => d.mCollect.CreateFieldsConfig, ...config }
    ),
};

export default useMcollectFormConfig;
