import commonConfig from "config/common.js";
import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { set } from "lodash";
import get from "lodash/get";
import { cancelBillDetailsCard } from "./viewBillResource/cancelBillDetails";
import { cancelBillFooter } from "./viewBillResource/viewBillFooter";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Cancel Bill`,
    labelKey: "ABG_CANCEL_BILL"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-abg",
    componentPath: "ApplicationContainer",
    props: {
      number: getQueryArg(window.location.href, "consumerNumber"),
      label: {
        labelValue: "Consumer No",
        labelKey: "WS_COMMON_CONSUMER_NO_LABEL"
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
              name: "CancelCurrentBillReasons"
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
      dispatch(prepareFinalObject('applyScreenMdmsData.reasonForBillCancel', get(payload, 'MdmsRes.common-masters.CancelCurrentBillReasons', [])));
    }

  } catch (e) {
  }


  // return action;
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "cancelBill",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    set(action.screenConfig, "components.div.children.cancelBillDetailsCard.children.cardContent.children.searchContainer.children.reason.props.value", get(state.screenConfiguration.preparedFinalObject, 'UpdateBillCriteria.additionalDetails.reason', ''))
    set(action.screenConfig, "components.div.children.cancelBillDetailsCard.children.cardContent.children.searchContainer.children.addtionalPenalty.props.value", get(state.screenConfiguration.preparedFinalObject, 'UpdateBillCriteria.additionalDetails.additionalPenalty', ''))
    const additionalDetailsJson = "components.div.children.cancelBillDetailsCard.children.cardContent.children.searchContainer.children.addtionalDetails";
    if (get(state.screenConfiguration.preparedFinalObject, 'UpdateBillCriteria.additionalDetails.reason', '') == "OTHER") {
      set(action.screenConfig, `${additionalDetailsJson}.required`, true);
      set(action.screenConfig, `${additionalDetailsJson}.props.disabled`, false);
      set(action.screenConfig, `${additionalDetailsJson}.props.required`, true);
    } else {
      set(action.screenConfig, `${additionalDetailsJson}.required`, false);
      set(action.screenConfig, `${additionalDetailsJson}.props.disabled`, true);
      set(action.screenConfig, `${additionalDetailsJson}.props.required`, false);
    }
    set(action.screenConfig, `${additionalDetailsJson}.props.value`, get(state.screenConfiguration.preparedFinalObject, 'UpdateBillCriteria.additionalDetails.additionalDetails', ''));
    set(action.screenConfig, `${additionalDetailsJson}.props.error`, false);
    const consumerNumber = getQueryArg(window.location.href, "consumerNumber");
    set(
      action.screenConfig,
      "components.div.children.headerDiv.children.header.children.applicationNumber.props.number",
      consumerNumber
    );
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
        cancelBillDetailsCard,
        cancelBillFooter
      }
    }
  }
};

export default screenConfig;
