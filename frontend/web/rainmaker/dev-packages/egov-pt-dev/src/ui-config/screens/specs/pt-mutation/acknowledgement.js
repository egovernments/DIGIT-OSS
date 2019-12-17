import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  applicationSuccessFooter,
  gotoHomeFooter,
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import generatePdf from "../utils/receiptPdf";

import set from "lodash/set";
import get from "lodash/get";

import { loadPdfGenerationData } from "../utils/receiptTransformer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Transfer of Ownership`, 
    labelKey: "PT_MUTATION_APPLICATION_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pt",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber"),
      label: {
        labelValue: "Application No.",
        labelKey: "PT_MUTATION_APPLICATION_NO"
    }
    },
    visible: true
  }
});


const getHeader=(applicationNumber)=>{
return getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Transfer of Ownership`, 
    labelKey: "PT_MUTATION_APPLICATION_HEADER"
  }),
  // applicationNumber: {
  //   uiFramework: "custom-atoms-local",
  //   moduleName: "egov-pt",
  //   componentPath: "ApplicationNoContainer",
  //   props: {
  //     number:applicationNumber,
  //     label: {
  //       labelValue: "Application No.",
  //       labelKey: "PT_MUTATION_APPLICATION_NO"
  //   }
  //   },
  //   visible: true
  // }
})
}


const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant
) => {
  if (purpose === "apply" && status === "success") {
    loadPdfGenerationData(applicationNumber, tenant);
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_SUCCESS_HEADER"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to both Transferor and Transferee at registered Mobile No. Please note your application  No for future reference.",
              labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_SUCCESS_MESSAGE"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          }),
          abc: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
              downloadFormButton: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {

                  div1: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                 
                    props:{
                      iconName: "cloud_download",
                    style:{
                      marginTop: "7px",
                      marginRight: "8px",
                    }
                  },
                    onClick: {
                      action: "condition",
                      callBack: () => {
                        generatePdf(state, dispatch, "application_download");
                      },
                    },
                  },
                  div2: getLabel({
                    labelName: "ACKNOWLEDGEMENT FORM",
                    labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_FORM"
                  })

                },
                onClickDefination: {
                  action: "condition",
                  callBack: () => {
                    generatePdf(state, dispatch, "application_download");
                  }
                },
              }
            },
            props: {
              style: {
                display: "flex",

              }
            },
          }
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  }  else if (purpose === "apply" && status === "failure") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application Submitted Failed",
              labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_FAILURE_HEADER"
            },
            body: {
              labelName:
                "A notification regarding Application Submission failure has been sent to both Transferor and Transferee at registered Mobile No.",
              labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_FAILURE_MESSAGE"
            }
          })
        }
      },
      gotoHomeFooter
    };
  }
};

const setApplicationData = async (dispatch, applicationNumber, tenant) => {
  const queryObject = [
    {
      key: "tenantId",
      value: tenant
    },
    {
      key: "applicationNumber",
      value: applicationNumber
    }
  ];
  const response = await getSearchResults(queryObject);
  dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));
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
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant
    );
    setApplicationData(dispatch, applicationNumber, tenant);
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
