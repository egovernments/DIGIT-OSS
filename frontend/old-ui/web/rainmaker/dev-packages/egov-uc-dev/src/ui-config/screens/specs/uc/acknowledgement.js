import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  acknowledgementSuccesFooter,
  acknowledgementFailureFooter
} from "./acknowledgementResource/acknowledgementFooter";
import set from "lodash/set";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults } from "../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  receiptNumber,
  secondNumber,
  tenant
) => {
  if (purpose === "pay" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `New Collection`,
        labelKey: "UC_COMMON_HEADER"
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          style: {
            position: "absolute",
            width: "95%"
          }
        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Payment has been collected successfully!",
              labelKey: "UC_PAYMENT_COLLECTED_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Payment Collection has been sent to the consumer at registered Mobile No.",
              labelKey: "UC_PAYMENT_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "payment receipt no.",
              labelKey: "UC_PAYMENT_NO_LABEL"
            },
            number: receiptNumber
          })
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: acknowledgementSuccesFooter
    };
  } else if (purpose === "pay" && status === "failure") {
    return {
      header: getCommonHeader({
        labelName: `New collection`,
        labelKey: "new collection"
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment Collection failed!",
              labelKey: "UC_PAYMENT_FAILED"
            },
            body: {
              labelName: "Payment Collection has been failed!",
              labelKey: "UC_PAYMENT_NOTIFICATION"
            }
          })
        }
      },
      paymentFailureFooter: acknowledgementFailureFooter
    };
  }
};

const getSearchData = async (dispatch, queryObj) => {
  const response = await getSearchResults(queryObj);
  response &&
    response.Receipt &&
    response.Receipt.length > 0 &&
    dispatch(
      prepareFinalObject("receiptSearchResponse.Receipt", response.Receipt)
    );
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const receiptNumber = getQueryArg(window.location.href, "receiptNumber");
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const serviceCategory = getQueryArg(
      window.location.href,
      "serviceCategory"
    );
    const tenantId = getTenantId();
    const queryObject = [
      {
        key: "tenantId",
        value: tenantId
      },
      { key: "offset", value: "0" },
      {
        key: "receiptNumbers",
        value: receiptNumber
      },
      {
        key: "businessServices",
        value: serviceCategory
      }
    ];

    getSearchData(dispatch, queryObject);

    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      receiptNumber,
      secondNumber,
      tenant
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
