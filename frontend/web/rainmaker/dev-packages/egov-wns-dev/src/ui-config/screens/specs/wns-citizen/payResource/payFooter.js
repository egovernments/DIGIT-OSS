import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter } from "../../utils";
import "./index.css";
export const payFooter = getCommonApplyFooter({
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
        labelKey: "WS_COMMON_BUTTON_DOWNLOAD_RECEIPT"
      })
    },
    onClickDefination: {
      action: "condition",
      // callBack: callBackForPrevious
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
      printRecipeButton: getLabel({
        labelKey: "WS_COMMON_BUTTON_PRINT_RECEIPT"
      })
    },
    onClickDefination: {
      action: "condition",
      // callBack: callBackForPrevious
    },
    // visible: false
  },
});