import React from "react";
import { useQuery } from "react-query";
import { MdmsService } from "../services/elements/MDMS";

const useMDMSData = {
  linkData: (tenantId) =>
    useQuery(
      [tenantId, "LINK_DATA"],
      () =>
        MdmsService.getDataByCriteria(
          tenantId,
          {
            details: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName:"ACCESSCONTROL-ACTIONS-TEST",
                  masterDetails:[
                    {
                      name:"actions-test",
                      filter:"[?(@.url == 'digit-ui-card')]"
                    }
                  ]
                }
              ],
            },
          },
          "ACCESSCONTROL-ACTIONS-TEST"
        ),
        {}
    ),

};

export default useMDMSData;
