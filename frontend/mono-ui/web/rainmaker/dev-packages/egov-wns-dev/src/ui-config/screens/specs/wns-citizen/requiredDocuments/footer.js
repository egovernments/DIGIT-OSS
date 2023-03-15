import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";

const printDiv = () => {
  let content = document.getElementById("documents-div").innerHTML;
  let printWindow = window.open("", "");

  printWindow.document.write(`<html><body>${content}</body></html>`);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

const startApplyFlow = (state, dispatch) => {
  dispatch(prepareFinalObject("FireNOCs", []));
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? `/egov-ui-framework/fire-noc/apply` : `/fire-noc/apply`;
  dispatch(setRoute(applyUrl));
};

export const footer = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  props: {
    className: "apply-wizard-footer",

    style: {
      width: "100%",
      textAlign: "center",
      bottom: 52
    }
  },

  // props: {
  //   className: "apply-wizard-footer",
  //   style: {
  //     textAlign: "center"
  //   }
  // },
  children: {
    printButton: {
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
        printButtonLabel: getLabel({
          labelName: "Print",
          labelKey: "NOC_COMMON_BUTTON_PRINT"
        })
      },
      visible: true,
      onClickDefination: {
        action: "condition",
        callBack: printDiv
      }
    },
    applyButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        applyButtonLabel: getLabel({
          labelKey: "WS_COMMON_BUTTON_APPLY"
        })
      },
      visible: true,
      onClickDefination: {
        action: "condition",
        callBack: startApplyFlow
      }
      //Add onClickDefinition:
    }
  }
};
