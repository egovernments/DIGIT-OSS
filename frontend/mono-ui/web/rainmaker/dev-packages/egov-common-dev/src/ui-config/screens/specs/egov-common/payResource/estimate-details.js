import { getCommonGrayCard } from "egov-ui-framework/ui-config/screens/specs/utils";

const estimate = getCommonGrayCard({
  estimateCard: {
    uiFramework: "custom-containers-local",
    componentPath: "EstimateCardContainer",
    moduleName: "egov-common",
    props: {
      estimate: {
        header: { labelName: "Fee Estimate", labelKey: "NOC_SUMMARY_FEE_EST" },
        fees: [{ name: "ASD", value: 123 }],
        extra: [
          { textLeft: "Last Date for Rebate (20% of TL)" },
          {
            textLeft: "Penalty (10% of TL) applicable from"
          },
          { textLeft: "Additional Penalty (20% of TL) applicable from" }
        ]
      }
    }
  }
});

export default estimate;
