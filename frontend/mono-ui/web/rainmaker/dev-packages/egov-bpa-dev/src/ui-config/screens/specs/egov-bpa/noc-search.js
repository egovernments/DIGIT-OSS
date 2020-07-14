import {
  getCommonHeader,
  getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { nocApplication, resetFields } from "./noc-searchResource/nocApplication";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchResults } from "./noc-searchResource/searchResults";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";

const header = getCommonHeader({
  labelName: "NOC_APPLICATION_HEADER",
  labelKey: "NOC Application"
});

export const getNOCMdmsData = async (action, state, dispatch, mdmsBody) => {
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

const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId().split('.')[0],
      moduleDetails: [
        {
          moduleName: "NOC",
          masterDetails: [
            {
              name: "NocType"
            }
          ]
        }
      ]
    }
  };

  let payload = await getNOCMdmsData(action, state, dispatch, mdmsBody);
  dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
};

const BpaSearchAndResult = {
  uiFramework: "material-ui",
  name: "noc-search",
  beforeInitScreen: (action, state, dispatch) => {
    resetFields(state, dispatch);
    getMdmsData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "noc-search"
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
        nocApplication,
        breakAfterSearch: getBreak(),
        searchResults
      }
    }
  }
};

export default BpaSearchAndResult;
