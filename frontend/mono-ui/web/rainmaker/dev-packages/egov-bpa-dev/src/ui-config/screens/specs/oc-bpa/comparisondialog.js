import {
  getCommonContainer,
  getCommonCard,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoHome } from "../utils";

export const comparisondialog = getCommonCard({
  reportChildren: getCommonContainer({
    comparisionReport: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-bpa",
      componentPath: "ComparisionLink",
      gridDefination: {
        xs: 12,
        sm: 12,
      },
      props: {
        label: {
          labelName: "Building Permit Number",
          labelKey: "EDCR_BUILDING_PERMIT_NUM_LABEL",
        },
        jsonPath: "BPA.comparisionReport",
      },
      type: "array",
    },
    div2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 12,
        alignItems: "center",
      },
      props: {
        style: {
          width: "100%",
          float: "right",
          cursor: "pointer",
        },
      },

      children: {
        submitButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              minWidth: "100px",
              height: "48px",
              float: "right",
            },
          },
          children: {
            submitButtonLabel: getLabel({
              labelName: "OK",
              labelKey: "BPA_COMMON_BUTTON_OK",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoHome,
          },

          visible: true,
        },
      },
    },
  }),
});
