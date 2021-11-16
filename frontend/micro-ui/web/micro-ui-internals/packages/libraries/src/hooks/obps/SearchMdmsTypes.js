import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const SearchMdmsTypes = {
  useApplicationTypes: (tenantId) =>
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
        select: (data) =>{
          return [...data?.BPA?.ApplicationType?.map((type) => ({
              code: type.code,
              i18nKey: `WF_BPA_${type.code}`,
            })),{
              code: "BPA_STAKEHOLDER_REGISTRATION",
              i18nKey: "WF_BPA_BPA_STAKEHOLDER_REGISTRATION",
          }]
        },
      }
    ),

    useServiceTypes: (tenantId) =>
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
        select: (data) =>{
          return [...data?.BPA?.ServiceType?.map((type) => ({
            code: type.code,
            i18nKey: `BPA_SERVICETYPE_${type.code}`,
            applicationType: type.applicationType,
          })),{
            applicationType:["BPA_STAKEHOLDER_REGISTRATION"],
            code: "BPA_STAKEHOLDER_REGISTRATION",
            i18nKey: "BPA_SERVICETYPE_BPA_STAKEHOLDER_REGISTRATION",
        }]
        },
      }
    ),
};

export default SearchMdmsTypes;