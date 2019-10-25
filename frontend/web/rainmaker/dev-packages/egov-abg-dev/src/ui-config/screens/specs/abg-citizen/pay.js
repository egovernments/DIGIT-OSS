import {
  getCommonCard,
  getCommonHeader,
  getCommonContainer,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { amountToBePaid } from "./payResource/amount";
import { billDetails } from "./payResource/billDetails";
import { footer } from "./payResource/footer";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Universal Bill",
    labelKey: "ABG_UNIVERSAL_BILL_COMMON_HEADER"
  }),
  billNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-abg",
    componentPath: "BillNoContainer",
    props: {
      number: getQueryArg(window.location.href, "billNumber")
    }
  }
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "pay",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    // if (applicationNumber)
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        body: getCommonCard({
          billDetails: billDetails,
          amount: amountToBePaid
          // breakAfterCard: getBreak()
        }),
        footer: footer
      }
    }
  }
};

export default screenConfig;
