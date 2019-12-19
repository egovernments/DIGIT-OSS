import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter } from "../../utils";
import { wsDownloadConnectionDetails } from "../../../../../ui-utils/commons";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

const callDownload = (state, dispatch, mode) => {
  const val = [
    {
      key: 'connectionNumber',
      value: getQueryArg(window.location.href, "connectionNumber")
    },

    { key: 'tenantId', value: getQueryArg(window.location.href, "tenantId") }]
  wsDownloadConnectionDetails(val, mode);
}



export const connectionDetailsFooter = getCommonApplyFooter({
  downloadButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadButton: getLabel({
        labelKey: "WS_COMMON_BUTTON_DOWNLOAD"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        callDownload(state, dispatch, "download");
      }
    },
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      printButton: getLabel({
        labelKey: "WS_COMMON_BUTTON_PRINT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        callDownload(state, dispatch, "print");
      }
    },
    // visible: false
  },
});