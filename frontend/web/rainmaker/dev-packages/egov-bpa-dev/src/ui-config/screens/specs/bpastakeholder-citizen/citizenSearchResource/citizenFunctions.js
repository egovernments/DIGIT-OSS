import { getSearchResults } from "../../../../../ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import get from "lodash/get";
import {getWorkFlowData} from "../../bpastakeholder/searchResource/functions";
import {
  getTextToLocalMapping
} from "../../utils/index";
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
  const mdmsRes = await getMdmsData(dispatch);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "TL") return true;
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

    if (response && response.Licenses && response.Licenses.length > 0) {


      const businessIdToOwnerMapping = await getWorkFlowData(response.Licenses);
      let searchConvertedArray = [];
      response.Licenses.forEach(element => {
        let service = getTextToLocalMapping("MODULE_"+get(element,"businessService"));
        let licensetypeFull = element.tradeLicenseDetail.tradeUnits[0].tradeType;
        if(licensetypeFull.split(".").length>1)
        {
          service +=" - "+getTextToLocalMapping(`TRADELICENSE_TRADETYPE_${getTransformedLocale(licensetypeFull.split(".")[0])}`); 
        }
        service+=" - "+getTextToLocalMapping(`TRADELICENSE_TRADETYPE_${getTransformedLocale(licensetypeFull)}`);  
        searchConvertedArray.push({
          applicationNumber: get(element,"applicationNumber",null),
          ownername: get(element,"tradeLicenseDetail.owners[0].name",null),
          businessService: service,
          assignedTo: get(businessIdToOwnerMapping[element.applicationNumber],"assignee",null),
          status: get(element, "status",null),
          sla: get(businessIdToOwnerMapping[element.applicationNumber],"sla",null)
        });
      });
      dispatch(prepareFinalObject("searchResults", searchConvertedArray));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.Licenses.length)
      );
      const myApplicationsCount = response.Licenses.length;
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
    }
  } catch (error) {
    console.log(error);
  }
};
