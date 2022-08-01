import React from "react";
import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const usePGRMDMS = {
    ComplainClosingTime: (tenantId) =>
    useQuery(
      [tenantId, "PGR_COMPLAIN_IDLE_TIME"],
      () =>
        MdmsService.getDataByCriteria(
          tenantId,
          {
            details: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "RAINMAKER-PGR",
                  masterDetails: [
                    {
                      name: "ComplainClosingTime",
                    },
                  ],
                },
              ],
            },
          },
          "RAINMAKER-PGR"
        ),
      {
        select: (data) =>
         data[`RAINMAKER-PGR`].ComplainClosingTime?.[0]?.ComplainMaxIdleTime,
      }
    ),
};

export default usePGRMDMS;