import { getBreak, getCommonHeader, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { billSearchCard } from "./billSearchResources/billSearchCard";
import { searchResults } from "./billSearchResources/searchResults";
import "./index.css";

const header = getCommonHeader({
  labelName: "Bill Cancellation",
  labelKey: "ABG_BILL_CANCELLATION_HEADER"
});
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

export const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "BillingService",
          masterDetails: [
            {
              name: "BusinessService"
            }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "uiCommonPay"
            }
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        }
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    payload.MdmsRes.BillingService.BusinessService = payload.MdmsRes.BillingService.BusinessService.filter(service => service.billGineiURL);
  let filteredData = payload.MdmsRes["common-masters"].uiCommonPay.filter(data => {if (data.cancelBill) return data});
  let serviceListData = [];
  filteredData && filteredData.length > 0 && filteredData.forEach (data => {
    payload.MdmsRes.BillingService.BusinessService.forEach(service => {
      if (service.code === data.code) {
        serviceListData.push(service);
      }
    })
  });
  payload.MdmsRes.BillingService.BusinessService = serviceListData;
  payload.MdmsRes["common-masters"].uiCommonPay
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    return payload.MdmsRes
  } catch (e) {
  }
};

const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};

const billSearchAndResult = {
  uiFramework: "material-ui",
  name: "billSearch",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    const tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;
    if (tenantId) {
      dispatch(prepareFinalObject("searchScreen", { tenantId: tenantId }));
      const ulbComponentJsonPath = "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.ulb";
      const disableUlb = process.env.REACT_APP_NAME === "Citizen" ? false : true;
      dispatch(
        handleField(
          "billSearch",
          ulbComponentJsonPath,
          "props.value",
          tenantId
        )
      );
      dispatch(
        handleField(
          "billSearch",
          ulbComponentJsonPath,
          "props.disabled",
          disableUlb
        )
      );
    }

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "billSearch"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
          }
        },
        billSearchCard,
        breakAfterSearch: getBreak(),
        searchResults
      }
    }
  }
};

export default billSearchAndResult;