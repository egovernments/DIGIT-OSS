import commonConfig from "config/common.js";
import {
  getBreak, getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { httpRequest } from "../../../../ui-utils/api";
import { nocApplication, resetFields } from "./searchResource/nocApplication";
import { searchResults } from "./searchResource/searchResults";

const header = getCommonHeader({
  labelName: "NOC Application",
  labelKey: "NOC_APPLICATION_HEADER"
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
      tenantId: commonConfig.tenantId,
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
  setNocTypeResponse(action, state, dispatch)
};

const setNocTypeResponse = (action, state, dispatch) => {
  let userInfo = JSON.parse(getUserInfo());
  let nocData = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.NOC.NocType", []);
  userInfo.roles && userInfo.roles.map(role => {
    nocData.map(nocType => {
      if (role.code === nocType.NocUserRole) {
        dispatch(prepareFinalObject("nocType", nocType.code));
      }
    })
  })
}

const BpaSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
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
