import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

export const billDetails = getCommonGrayCard({
  estimateCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-abg",
    componentPath: "EstimateCardContainer",

    props: {
    }
  }
});
