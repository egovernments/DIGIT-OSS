import { getBreak, getCommonHeader, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../ui-utils";
import { getRequiredDocData } from "../utils";
import "./index.css";
import { searchCard } from "./searchResources/searchCard";
import { searchResults } from "./searchResources/searchResults";

const header = getCommonHeader({
  labelName: "Universal Bill",
  labelKey: "BILL_UNIVERSAL_BILL_COMMON_HEADER"
});
const subHeader = getCommonSubHeader({
  labelName: "Universal Bill",
  labelKey: "BILL_UNIVERSAL_BILL_COMMON_SUBHEADER"
});

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
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
          moduleName: "BillAmendment",
          masterDetails: [
            { name: "documentObj" }
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
    getRequiredDocData(action, dispatch, [{
      moduleName: "BillAmendment",
      masterDetails: [
        { name: "documentObj" }
      ]
    }])
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    payload.MdmsRes.BillingService.BusinessService = payload.MdmsRes.BillingService.BusinessService.filter(service => service.isBillAmendmentEnabled);
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
  }
};

const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    const tenantId = getTenantId();
    if (tenantId) {
      dispatch(prepareFinalObject("searchScreenBillAmend", { tenantId: tenantId, businessService: "", mobileNumber: "", amendmentId: "", consumerCode: "" }));
      const ulbComponentJsonPath = "components.div.children.searchCard.children.cardContent.children.searchContainer.children.ulb";

      dispatch(
        handleField(
          "search",
          ulbComponentJsonPath,
          "props.value",
          tenantId
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
        id: "search"
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
            }
          }
        },
        subHeaderDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            subHeader: {
              gridDefination: {
                xs: 12,
                sm: 12
              },
              ...subHeader
            },
          }
        },
        searchCard,
        breakAfterSearch: getBreak(),
        searchResults
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default screenConfig;
