import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { searchApiCall } from "./billDownloadResources/function";
import { searchResults } from "./billDownloadResources/searchResults";
import "./index.css";

const header = getCommonHeader({
  labelName: "DOWNLOADS",
  labelKey: "ABG_BILL_DOWNLOAD_HEADER",
});

const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "uiCommonPay",
            },
          ],
        },
      ],
    },
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
  }
};

const getData = async (action, state, dispatch) => {
  getMDMSData(action, state, dispatch);
  await searchApiCall(state, dispatch);
};

const billDownload = {
  uiFramework: "material-ui",
  name: "billDownload",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "billDownload",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
              },
              ...header,
            },
          },
        },
        searchResults,
      },
    },
  },
};

export default billDownload;
