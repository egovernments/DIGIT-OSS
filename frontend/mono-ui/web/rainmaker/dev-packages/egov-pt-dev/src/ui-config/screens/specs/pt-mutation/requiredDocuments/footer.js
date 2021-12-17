import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

const printDiv = () => {
  let content = document.getElementById("documents-div").innerHTML;
  let printWindow = window.open("", "");

  printWindow.document.write(`<html><body>${content}</body></html>`);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

export const startApplyFlow = (state, dispatch) => {
  dispatch(prepareFinalObject("ptmDocumentsUploadRedux", {}));
  const applyUrl = `/property-tax/assessment-form`;
  dispatch(setRoute(applyUrl));
};

export const startMutationApplyFlow = (state, dispatch) => {
  dispatch(prepareFinalObject("ptmDocumentsUploadRedux", {}));
  dispatch(prepareFinalObject("Property", {}));
  const consumerCode = getQueryArg(
    window.location.href,
    "consumerCode"
  );
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const applyUrl = `/pt-mutation/apply?consumerCode=${consumerCode}&tenantId=${tenantId}`;
  dispatch(setRoute(applyUrl));
}

export const footer = {
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
          labelKey: "PT_COMMON_BUTTON_PRINT"
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
          labelKey: "PT_COMMON_BUTTON_APPLY"
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
