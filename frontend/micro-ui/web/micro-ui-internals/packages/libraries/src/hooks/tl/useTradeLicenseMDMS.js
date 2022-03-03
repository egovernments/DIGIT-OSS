import { MdmsService } from "../../services/elements/MDMS";
import { useQuery } from "react-query";

const useTradeLicenseMDMS = (tenantId, moduleCode, type, filter, config = {}) => {
  const useTLDocuments = () => {
    return useQuery("TL_DOCUMENTS", () => MdmsService.getTLDocumentRequiredScreen(tenantId, moduleCode, type), config);
  };
  const useStructureType = () => {
    return useQuery("TL_STRUCTURE_TYPE", () => MdmsService.getTLStructureType(tenantId, moduleCode, type), config);
  };
  const useTradeUnitsData = () => {
    return useQuery("TL_TRADE_UNITS", () => MdmsService.getTradeUnitsData(tenantId, moduleCode, type, filter), config);
  };
  const useTradeOwnerShipCategory = () => {
    return useQuery("TL_TRADE_OWNERSHIP_CATEGORY", () => MdmsService.GetTradeOwnerShipCategory(tenantId, moduleCode, type), config);
  };
  const useTradeOwnershipSubType = () => {
    return useQuery("TL_TRADE_OWNERSHIP_CATEGORY", () => MdmsService.GetTradeOwnerShipCategory(tenantId, moduleCode, type), {
      select: data => {
        const {"common-masters":{OwnerShipCategory: categoryData} ={}} = data
        const filteredSubtypesData = categoryData.filter( e => e.code.includes(filter.keyToSearchOwnershipSubtype)).map( e => ({...e, i18nKey: `COMMON_MASTERS_OWNERSHIPCATEGORY_${e.code.replaceAll(".", "_")}`}))
        return filteredSubtypesData
      },
      ...config
    });
  };

  const useOwnerTypeWithSubtypes = () => {
    return useQuery("TL_TRADE_OWNERSSHIP_TYPE", () => MdmsService.GetTradeOwnerShipCategory(tenantId, moduleCode, type), {
      select: data => {
        const {"common-masters":{OwnerShipCategory: categoryData} ={}} = data
        let OwnerShipCategory = {};
        let ownerShipdropDown = [];
        
        function getDropdwonForProperty(ownerShipdropDown) {
          if (filter?.userType === "employee") {
            const arr = ownerShipdropDown
              ?.filter((e) => e.code.split(".").length <= 2)
              ?.map((ownerShipDetails) => ({
                ...ownerShipDetails,
                i18nKey: `COMMON_MASTERS_OWNERSHIPCATEGORY_INDIVIDUAL_${
                  ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0]
                }`,
              }));
              const finalArr = arr.filter(data => data.code.includes("INDIVIDUAL") || data.code.includes("OTHER"))
      
            return finalArr;
          }
      
          const res = ownerShipdropDown?.length ? ownerShipdropDown?.map((ownerShipDetails) => ({
                ...ownerShipDetails,
                i18nKey: `PT_OWNERSHIP_${
                  ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0]
                }`,
              })).reduce((acc, ownerShipDetails) => {
                if(ownerShipDetails.code.includes("INDIVIDUAL")){
                  return [...acc, ownerShipDetails]
                } else if (ownerShipDetails.code.includes("OTHER")) {
                  const { code, value, ...everythingElse } = ownerShipDetails
                  const mutatedOwnershipDetails =  { code: code.split(".")[0], value: value.split(".")[0], ...everythingElse }
                  return [...acc, mutatedOwnershipDetails]
                } else {
                  return acc
                }
              },[]) : null
              
          return res
        }

        function formDropdown(category) {
          const { name, code } = category;
          return {
            label: name,
            value: code,
            code: code,
          };
        }

        categoryData.length > 0 ? categoryData?.map((category) => {
          OwnerShipCategory[category.code] = category;
        }) : null

        if (OwnerShipCategory) {
          Object.keys(OwnerShipCategory).forEach((category) => {
            // const categoryCode = OwnerShipCategory[category].code;
            ownerShipdropDown.push(formDropdown(OwnerShipCategory[category]));
          });
        }
        
        return getDropdwonForProperty(ownerShipdropDown);
    
      },
      ...config
    });
  };
  const useTLAccessoriesType = () => {
    return useQuery("TL_TRADE_ACCESSORY_CATEGORY", () => MdmsService.getTLAccessoriesType(tenantId, moduleCode, type), config);
  };
  const useTLFinancialYear = () => {
    return useQuery("TL_TRADE_FINANCIAL_YEAR", () => MdmsService.getTLFinancialYear(tenantId, moduleCode, type), config);
  };
  const _default = () => {
    return useQuery([tenantId, moduleCode, type], () => MdmsService.getMultipleTypes(tenantId, moduleCode, type), config);
  };

  switch (type) {
    case "TLDocuments":
      return useTLDocuments();
    case "StructureType":
      return useStructureType();
    case "TradeUnits":
      return useTradeUnitsData();
    case "TLOwnerShipCategory":
      return useTradeOwnerShipCategory();
    case "TLOwnerTypeWithSubtypes":
      return useOwnerTypeWithSubtypes();
    case "AccessoryCategory":
      return useTLAccessoriesType();
    case "FinancialYear":
      return useTLFinancialYear();
    case "TradeOwnershipSubType":
      return useTradeOwnershipSubType();
    default:
      return _default();
  }
};

export default useTradeLicenseMDMS;
