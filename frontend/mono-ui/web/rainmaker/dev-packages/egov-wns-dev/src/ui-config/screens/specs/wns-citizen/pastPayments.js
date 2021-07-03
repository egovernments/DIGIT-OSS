import { getPastPaymentsForWater,getPastPaymentsForSewerage } from "../../../../ui-utils/commons";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
const header = getCommonHeader(
  {
    labelKey: "WS_COMMON_PAST_PAYMENTS"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
const screenConfig = {
  uiFramework: "material-ui",
  name: "my-connections",
  beforeInitScreen: (action, state, dispatch) => {
    getPastPaymentsForWater(dispatch);
    getPastPaymentsForSewerage(dispatch)
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applicationsCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-wns",
          componentPath: "PastPaymentsDetails"
        }
      }
    }
  }
};
export default screenConfig;