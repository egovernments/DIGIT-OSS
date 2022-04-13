import commonConfig from "config/common.js";
import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { set } from "lodash";
import get from "lodash/get";
import { cancelReceiptDetailsCard } from "./cancelReceiptResource/cancelReceiptDetails";
import { cancelReceiptFooter } from "./cancelReceiptResource/cancelReceiptFooter";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Cancel Receipt`,
    labelKey: "CR_COMMON_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-abg",
    componentPath: "ApplicationContainer",
    props: {
      number: getQueryArg(window.location.href, "receiptNumbers"),
      label: {
        labelValue: "Receipt Details Receipt No.",
        labelKey: "CR_RECEIPT_DETAILS_NUMBER"
      }
    },
    visible: true
  }
});
const getData = async (action, state, dispatch) => {

  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "CancelReceiptReason"
            }
          ]
        }
      ]
    }
  };

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );

    if (payload) {
      dispatch(prepareFinalObject('applyScreenMdmsData.reasonForReceiptCancel', get(payload, 'MdmsRes.common-masters.CancelReceiptReason', [])));
    }

  } catch (e) {
  }


  // return action;
};

const cancelReceipt = {
  uiFramework: "material-ui",
  name: "cancelReceipt",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    set(action.screenConfig, "components.div.children.cancelReceiptDetailsCard.children.cardContent.children.searchContainer.children.reason.props.value", get(state.screenConfiguration.preparedFinalObject, 'paymentWorkflows[0].reason', ''))
    set(action.screenConfig, "components.div.children.cancelReceiptDetailsCard.children.cardContent.children.searchContainer.children.addtionalPenalty.props.value", get(state.screenConfiguration.preparedFinalObject, 'paymentWorkflows[0].additionalPenalty', ''))
    const additionalDetailsJson = "components.div.children.cancelReceiptDetailsCard.children.cardContent.children.searchContainer.children.addtionalDetails";
    if (get(state.screenConfiguration.preparedFinalObject, 'paymentWorkflows[0].reason', '') == "OTHER") {
      set(action.screenConfig, `${additionalDetailsJson}.required`, true)
      set(action.screenConfig, `${additionalDetailsJson}.props.disabled`, false)
      set(action.screenConfig, `${additionalDetailsJson}.props.required`, true)
    } else {
      set(action.screenConfig, `${additionalDetailsJson}.required`, false)
      set(action.screenConfig, `${additionalDetailsJson}.props.disabled`, true)
      set(action.screenConfig, `${additionalDetailsJson}.props.required`, false)
    }
    set(action.screenConfig, `${additionalDetailsJson}.props.value`, get(state.screenConfiguration.preparedFinalObject, 'paymentWorkflows[0].additionalDetails', ''))
    set(action.screenConfig, `${additionalDetailsJson}.props.error`, false)
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "cancelReceipt"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }
          }
        },
        cancelReceiptDetailsCard,
        cancelReceiptFooter
      }
    }
  }
};

export default cancelReceipt;
