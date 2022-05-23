import { useQuery } from "react-query";
import { getMultipleTypes, MdmsService, getGeneralCriteria } from "../../services/elements/MDMS"

const WSSearchMdmsTypes = {
  useWSMDMSBillAmendment: ({tenantId, config={}}) => {
    const BillAmendmentMdmsDetails = getMultipleTypes(tenantId, "BillAmendment", ["documentObj", "DemandRevisionBasis"])
    return useQuery([tenantId, "WS_BILLAMENDMENT_MDMS"], () => MdmsService.getDataByCriteria(tenantId, BillAmendmentMdmsDetails, "BillAmendment"), {
      select: ({BillAmendment}) => {
        return BillAmendment?.DemandRevisionBasis.map( (e, index) => {
          return { ...e, i18nKey: `DEMAND_REVISION_BASIS_${e.code}`, allowedDocuments: BillAmendment?.documentObj[index] }
        })
      },
      ...config
    });
  },
  useWSServicesMasters: (tenantId, type) =>
    useQuery(
      [tenantId, type, "WS_WS_SERVICES_MASTERS"],
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
                      name: type ?  type : "Documents"
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
          const wsDocsData = type ? type : "Documents";
          data?.["ws-services-masters"]?.[wsDocsData]?.forEach(type => {
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