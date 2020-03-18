import { getSearchResults,getBpaSearchResults } from "../../../../../ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import get from "lodash/get";
import { getWorkFlowData,getWorkFlowDataForBPA } from "../../bpastakeholder/searchResource/functions";
import { getTextToLocalMapping } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

const getMdmsData = async () => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [{ name: "citymodule" }]
        }
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};
export const fetchData = async (
  action,
  state,
  dispatch,
  fromMyApplicationPage = false
) => {
  const response = await getSearchResults();
  const bpaResponse = await getBpaSearchResults();
  const mdmsRes = await getMdmsData(dispatch);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "BPAAPPLY") return true;
    });
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.citiesByModule.TL",
      tenants
    )
  );
  try {
    /*Mseva 1.0 */
    // let data =
    //   response &&
    //   response.Licenses.map(item => ({
    //     [get(textToLocalMapping, "Application No")]:
    //       item.applicationNumber || "-",
    //     [get(textToLocalMapping, "License No")]: item.licenseNumber || "-",
    //     [get(textToLocalMapping, "Trade Name")]: item.tradeName || "-",
    //     [get(textToLocalMapping, "Owner Name")]:
    //       item.tradeLicenseDetail.owners[0].name || "-",
    //     [get(textToLocalMapping, "Application Date")]:
    //       convertEpochToDate(item.applicationDate) || "-",
    //     tenantId: item.tenantId,
    //     [get(textToLocalMapping, "Status")]:
    //       get(textToLocalMapping, item.status) || "-"
    //   }));

    // dispatch(
    //   handleField(
    //     "home",
    //     "components.div.children.applyCard.children.searchResults",
    //     "props.data",
    //     data
    //   )
    // );
    /*Mseva 2.0 */

    var searchConvertedArray = [];
    var sortConvertedArray = [];
    if (response && response.Licenses && response.Licenses.length > 0) {
      const businessIdToOwnerMapping = await getWorkFlowData(response.Licenses);

      response.Licenses.forEach(element => {
        let service = getTextToLocalMapping(
          "MODULE_" + get(element, "businessService")
        );

        let status = getTextToLocalMapping(
          "WF_ARCHITECT_" + get(element, "status")
        );
        let modifiedTime = element.auditDetails.lastModifiedTime;
        let licensetypeFull =
          element.tradeLicenseDetail.tradeUnits[0].tradeType;
        if (licensetypeFull.split(".").length > 1) {
          service +=
            " - " +
            getTextToLocalMapping(
              `TRADELICENSE_TRADETYPE_${getTransformedLocale(
                licensetypeFull.split(".")[0]
              )}`
            );
        }
        service +=
          " - " +
          getTextToLocalMapping(
            `TRADELICENSE_TRADETYPE_${getTransformedLocale(licensetypeFull)}`
          );
        searchConvertedArray.push({
          applicationNumber: get(element, "applicationNumber", null),
          ownername: get(element, "tradeLicenseDetail.owners[0].name", null),
          businessService: service,
          serviceType: "BPAREG",
          assignedTo: get(
            businessIdToOwnerMapping[element.applicationNumber],
            "assignee",
            null
          ),
          status,
          sla: get(
            businessIdToOwnerMapping[element.applicationNumber],
            "sla",
            null
          ),
          tenantId: get(element, "tenantId", null),
          modifiedTime: modifiedTime,
          sortNumber: 0
        });
      });

    }
    
    if(bpaResponse && bpaResponse.Bpa && bpaResponse.Bpa.length > 0){

    const businessIdToOwnerMappingForBPA = await getWorkFlowDataForBPA(bpaResponse.Bpa);
    bpaResponse.Bpa.forEach(element => {
      let status = getTextToLocalMapping(
        "WF_BPA_" + get(element, "status")
      );
      let service = getTextToLocalMapping(
        "BPA_APPLICATIONTYPE_" + get(element, "applicationType")
      );
      service += " - "+getTextToLocalMapping(
        "BPA_SERVICETYPE_" + get(element, "serviceType")
      );
      let modifiedTime = element.auditDetails.lastModifiedTime;
      let primaryowner = "-";
      let owners = get(element, "owners", [])
      owners.map(item=>{
        if(item.isPrimaryOwner)
        {
          primaryowner = item.name;
        }
      });
      searchConvertedArray.push({
        applicationNumber: get(element, "applicationNo", null),
        ownername: primaryowner,
        businessService: service,
        assignedTo: get(
          businessIdToOwnerMappingForBPA[element.applicationNo],
          "assignee",
          null
        ),
        status,
        sla: get(
          businessIdToOwnerMappingForBPA[element.applicationNo],
          "sla",
          null
        ),
        tenantId: get(element, "tenantId", null),
        modifiedTime: modifiedTime,
        sortNumber: 1,
        type: element.riskType
      })});
    }

    sortConvertedArray = [].slice.call(searchConvertedArray).sort(function(a,b){ 
      return new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.sortNumber - b.sortNumber;
     });

    dispatch(prepareFinalObject("searchResults", sortConvertedArray));
    dispatch(
      prepareFinalObject("myApplicationsCount", sortConvertedArray.length)
    );
    const myApplicationsCount = sortConvertedArray.length;
    if (fromMyApplicationPage) {
      dispatch(
        handleField(
          "my-applications",
          "components.div.children.header.children.key",
          "props.dynamicArray",
          myApplicationsCount ? [myApplicationsCount] : [0]
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
};
