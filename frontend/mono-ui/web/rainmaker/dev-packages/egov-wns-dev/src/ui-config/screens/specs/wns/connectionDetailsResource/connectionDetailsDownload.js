import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter } from "../../utils";
import { wsDownloadConnectionDetails } from "../../../../../ui-utils/commons";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

const callDownload = (mode) => {
  const val = [
    { key: 'connectionNumber', value: getQueryArg(window.location.href, "connectionNumber")},
    { key: 'tenantId', value: getQueryArg(window.location.href, "tenantId") },
    { key: "searchType", value: "CONNECTION" }
  ]
  wsDownloadConnectionDetails(val, mode);
}



export const connectionDetailsDownload = getCommonApplyFooter("RIGHT",{
  downloadButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "150px",
        height: "48px",
        marginRight: "10px"
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
        callDownload("download");
      }
    },
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "150px",
        height: "48px",
        marginRight: "10px"
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
        callDownload("print");
      }
    },
    // visible: false
  },
});