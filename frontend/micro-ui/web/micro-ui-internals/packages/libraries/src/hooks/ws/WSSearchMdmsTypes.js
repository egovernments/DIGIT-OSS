import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const WSSearchMdmsTypes = {
  useWSServicesMasters: (tenantId) =>
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
                      name: "Documents",
                    },
                  ],
                },
              ],
            },
          },
          "ws-services-masters"
        ),
      {
        select: (data) => {
          data?.["ws-services-masters"]?.Documents?.forEach(type => {
            type.code = type.code;
            type.i18nKey = type.code ? type.code.replaceAll('.', '_') : "";
            type.dropdownData.forEach(value => {
              value.i18nKey = value.code ? value.code.replaceAll('.', '_') : "";
            })
          })
          return data?.["ws-services-masters"] ? data?.["ws-services-masters"] : []
        }
      }
    ),

  useWSServicesCalculation: (tenantId) =>
    useQuery(
      [tenantId, "WS_WS_SERVICES_CALCULATION"],
      () =>
        MdmsService.getDataByCriteria(
          tenantId,
          {
            details: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "ws-services-calculation",
                  masterDetails: [
                    {
                      name: "PipeSize",
                    },
                  ],
                },
              ],
            },
          },
          "ws-services-calculation"
        ),
      {
        select: (data) => {
          data?.["ws-services-calculation"]?.PipeSize?.forEach(type => {
            type.i18nKey = type.size ? `${type.size} Inches` : "";
          })
          return data?.["ws-services-calculation"] ? data?.["ws-services-calculation"] : []
        }
      }
    )
};

export default WSSearchMdmsTypes;