import {
  getBreak, getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { httpRequest } from "../../../../ui-utils";
import { setServiceCategory } from "../utils";
import "./index.css";
import { searchResults } from "./universalCollectionResources/searchResults";
import { resetFields, UCSearchCard } from "./universalCollectionResources/ucSearch";

const tenantId = getTenantId();
const header = getCommonHeader({
  labelName: "Universal Collection",
  labelKey: "CR_COMMON_HEADER_SEARCH"
});


const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};

const getMDMSData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "BillingService",
          masterDetails: [
            { name: "BusinessService", filter: "[?(@.type=='Adhoc')]" }
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
    setServiceCategory(
      get(payload, "MdmsRes.BillingService.BusinessService", []),
      dispatch
    );
    let uiCommonPay=get(payload.MdmsRes, "common-masters.uiCommonPay",[]);
    dispatch(prepareFinalObject("applyScreenMdmsData.businessServices",uiCommonPay&&uiCommonPay.filter(config=>config.cancelReceipt)))
    dispatch(prepareFinalObject("applyScreenMdmsData.uiCommonConfig", get(payload.MdmsRes, "common-masters.uiCommonPay")))
  } catch (e) {
    alert("Billing service data fetch failed");
  }
};

const ucSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("receiptCancelSearch", {}))
    getData(action, state, dispatch);
    resetFields(state,dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "universalCollection"
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
        UCSearchCard,
        breakAfterSearch: getBreak(),
        searchResults
      }
    }
  }
};

export default ucSearchAndResult;

