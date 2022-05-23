import commonConfig from "config/common.js";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils";
import { getBpaSearchResults, getSearchResults } from "../../../../../ui-utils/commons";
import { getWorkFlowData, getWorkFlowDataForBPA } from "../../bpastakeholder/searchResource/functions";
import { getTextToLocalMapping } from "../../utils/index";

export const getMdmsData = async () => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [{ name: "citymodule" }]
        },
        {
          moduleName: "BPA",
          masterDetails: [{ name: "ServiceType" }]
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
  }
};
export const fetchData = async (
  action,
  state,
  dispatch,
  fromMyApplicationPage = false,
  fromStakeHolderPage = false
) => {
  let userInfo = JSON.parse(getUserInfo());
  let mobileNumber = get(userInfo, "mobileNumber");
  const queryObj = [
    {
      key: "requestor",
      value: mobileNumber
    }
  ];
  const response = await getSearchResults();
  const bpaResponse = await getBpaSearchResults(queryObj);
  const mdmsRes = await getMdmsData(dispatch);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "BPAAPPLY") return true;
    });
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData", mdmsRes.MdmsRes
    )
  );
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.citiesByModule.TL",
      tenants
    )
  );
  try {
    if (window.location.href.includes("bpastakeholder-citizen/home")) {
      let myApplicationsCount = 0;
      if (response && response.Licenses) {
        myApplicationsCount += response.Licenses.length
      }
      if (bpaResponse && bpaResponse.BPA) {
        myApplicationsCount += bpaResponse.BPA.length
      }
      dispatch(
        handleField(
          "my-applications",
          "components.div.children.header.children.key",
          "props.dynamicArray",
          myApplicationsCount ? [myApplicationsCount] : [0]
        )
      );
    } else {
      var searchConvertedArray = [];
      var sortConvertedArray = [];
      if (response && response.Licenses && response.Licenses.length > 0) {
        const businessIdToOwnerMapping = await getWorkFlowData(response.Licenses);

        response.Licenses.forEach(element => {
          let service = getTextToLocalMapping(
            "MODULE_" + get(element, "businessService")
          );
          let status = getTextToLocalMapping("WF_ARCHITECT_" + get(element, "status"));
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
          if (!fromStakeHolderPage) {
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
          }
        });
      }

      if (bpaResponse && bpaResponse.BPA && bpaResponse.BPA.length > 0) {
        const businessIdToOwnerMappingForBPA = await getWorkFlowDataForBPA(bpaResponse.BPA);
        bpaResponse.BPA.forEach(element => {
          let status = getTextToLocalMapping("WF_BPA_" + get(businessIdToOwnerMappingForBPA[element.applicationNo], "state", null));
          let applicationStatus = get(element, "status");
          let bService = get(element, "businessService");
          let appType = "BUILDING_PLAN_SCRUTINY";
          let serType = "NEW_CONSTRUCTION";
          let type;
          if (bService === "BPA_OC") {
            appType = "BUILDING_OC_PLAN_SCRUTINY"
          }
          if (bService === "BPA_LOW") {
            type = "LOW"
          } else {
            type = "HIGH"
          }
          let service = getTextToLocalMapping(
            "BPA_APPLICATIONTYPE_" + appType
          );
          service += " - " + getTextToLocalMapping(
            "BPA_SERVICETYPE_" + serType
          );
          let modifiedTime = element.auditDetails.lastModifiedTime;
          let primaryowner = "-";
          let owners = get(element, "landInfo.owners", [])
          owners.map(item => {
            if (item.isPrimaryOwner) {
              primaryowner = item.name;
            }
          });
          if (!fromStakeHolderPage) {
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
              type: type,
              serviceType: get(element, "businessService", null),
              appStatus: applicationStatus
            })
          }
        });
      }

      sortConvertedArray = [].slice.call(searchConvertedArray).sort(function (a, b) {
        return new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.sortNumber - b.sortNumber;
      });

      dispatch(prepareFinalObject("searchResults", sortConvertedArray));
      storeData(sortConvertedArray, dispatch, fromMyApplicationPage, fromStakeHolderPage);
    }
  } catch (error) {
  }
};

const storeData = (data, dispatch, fromMyApplicationPage, fromStakeHolderPage) => {
  dispatch(
    prepareFinalObject("myApplicationsCount", data.length)
  );
  const myApplicationsCount = data.length;

  if (fromStakeHolderPage) {
    dispatch(
      handleField(
        "my-applications-stakeholder",
        "components.div.children.applicationsCard",
        "props.data",
        data
      ));
    dispatch(
      handleField(
        "my-applications-stakeholder",
        "components.div.children.header.children.key",
        "props.dynamicArray",
        myApplicationsCount ? [myApplicationsCount] : [0]
      )
    );
  } else if (fromMyApplicationPage) {

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

