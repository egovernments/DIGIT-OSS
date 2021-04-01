import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

export const estimateSummary = getCommonGrayCard({
  estimateCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-uc",
    componentPath: "EstimateCardContainer",

    props: {
      // estimate: {
      //   header: { labelName: "", labelKey: "TL_SUMMARY_FEE_EST" },
      //   fees: [{ name: "ASD", value: 123 }],
      //   extra: [
      //     { textLeft: "Last Date for Rebate (20% of TL)" },
      //     {
      //       textLeft: "Penalty (10% of TL) applicable from"
      //     },
      //     { textLeft: "Additional Penalty (20% of TL) applicable from" }
      //   ]
      // }
    }
  }
});
