import {
  getBreak, getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { httpRequest } from "../../../../ui-utils";
import { setServiceCategory } from "../utils";
import "./index.css";
import { searchResults } from "./universalCollectionResources/searchResults";
import { UCSearchCard } from "./universalCollectionResources/ucSearch";


const tenantId = getTenantId();
const header = getCommonHeader({
  labelName: "Receipt",
  labelKey: "UC_RECEIPT"
});

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

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
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.serviceCategories",
        get(payload, "MdmsRes.BillingService.BusinessService", [])
      )
    );
    dispatch(prepareFinalObject("applyScreenMdmsData.uiCommonConfig", get(payload.MdmsRes, "common-masters.uiCommonPay")))
    setServiceCategory(
      get(payload, "MdmsRes.BillingService.BusinessService", []),
      dispatch, null, false
    );



  } catch (e) {
    console.log(e);

  }
};

const ucSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("ucSearchScreen", {}));
    getData(action, state, dispatch);
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
            },

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


