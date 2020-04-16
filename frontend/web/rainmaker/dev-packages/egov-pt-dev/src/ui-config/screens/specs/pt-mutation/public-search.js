import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getMohallaData } from "egov-ui-kit/utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { progressStatus } from "./searchResource/progressStatus";
import { searchPropertyTable } from "./publicSearchResource/search-table";
import { httpRequest } from "../../../../ui-utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import { searchPropertyDetails } from "./publicSearchResource/search-resources";
import { applyMohallaData } from "./publicSearchResource/publicSearchUtils";
import msevaLogo from "egov-ui-kit/assets/images/mseva-punjab.png";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;
const tenant = getTenantId();

//console.log(captureMutationDetails);

const getLocalityData = async (tenantId, dispatch) => {
  let payload = await httpRequest(
    "post",
    "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
    "_search",
    [{ key: "tenantId", value: tenantId }],
    {}
  );
  const mohallaData = getMohallaData(payload, tenantId);
  applyMohallaData(mohallaData, tenantId, dispatch);
};

const getMDMSData = async dispatch => {
  const mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            },
            { name: "citymodule" }
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
    payload.MdmsRes.tenant.tenants =
      payload.MdmsRes.tenant.citymodule[1].tenants;
    // console.log("payload--", payload)
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    // if (process.env.REACT_APP_NAME != "Citizen") {
    //   dispatch(prepareFinalObject("searchScreen.tenantId", tenant));
    //   getLocalityData(tenant, dispatch);
    // }
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "public-search",

  beforeInitScreen: (action, state, dispatch) => {
    //   resetFields(state, dispatch);
    getMDMSData(dispatch);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "public-domain-search",
        id: "search",
        style: {
          paddingLeft: "16px",
          paddingRight: "16px"
        }
      },
      children: {
        header: {
          uiFramework: "custom-containers-local",
          componentPath: "HeaderContainer",
          moduleName: "egov-pt",
          props: {
            msevaLogo: msevaLogo
          }
        },
        searchPropertyDetails,
        breakAfterSearch0: getBreak(),
        breakAfterSearch1: getBreak(),
        breakAfterSearch2: getBreak(),
        breakAfterSearch3: getBreak(),
        searchPropertyTable,
        breakAfterSearch4: getBreak()
      }
    }
  }
};

export default screenConfig;