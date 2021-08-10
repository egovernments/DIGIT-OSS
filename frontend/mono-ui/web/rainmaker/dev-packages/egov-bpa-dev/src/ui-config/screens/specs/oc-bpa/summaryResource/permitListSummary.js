import {
  getCommonGrayCard,
  getCommonSubHeader,
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const permitListSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Permit Conditions",
          labelKey: "BPA_PERMIT_CONDITIONS_LABEL"
        })
      }
    }
  },
  permitConditionsCardSummary: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "PermitListCondition",
    props: {
      sourceJsonPath: "permitList"
    },
    type: "array"
  }
});
