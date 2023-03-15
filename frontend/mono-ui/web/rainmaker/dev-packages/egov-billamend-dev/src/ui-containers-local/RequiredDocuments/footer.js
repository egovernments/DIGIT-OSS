import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

const printDiv = () => {
  let content = document.getElementById("documents-div").innerHTML;
  let printWindow = window.open("", "");

  printWindow.document.write(`<html><body>${content}</body></html>`);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// const startApplyFlow = (state, dispatch) => {
//   dispatch(prepareFinalObject("FireNOCs", []));
//   const applyUrl =
//     process.env.REACT_APP_SELF_RUNNING === "true" ? `/egov-ui-framework/fire-noc/apply` : `/fire-noc/apply`;
//   dispatch(setRoute(applyUrl));
// };
export const footer = ( startApplyFlow, moduleName )=>{
  return({
  uiFramework: "custom-atoms",
  componentPath: "Div",
  props: {
    className: "apply-wizard-footerReq",

    // style: {
    //   width: "93%",
    //   textAlign: "center",
    //   bottom: 52,
    //   left:48
    // }
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
         minWidth: "180px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        printButtonLabel: getLabel({
          labelName: "Print",
          labelKey: getTransformedLocale(`${moduleName}_COMMON_BUTTON_PRINT`)
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
         minWidth: "180px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        applyButtonLabel: getLabel({
          labelName: "Apply",
          labelKey: getTransformedLocale(`${moduleName}_COMMON_BUTTON_APPLY`)
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
})};
