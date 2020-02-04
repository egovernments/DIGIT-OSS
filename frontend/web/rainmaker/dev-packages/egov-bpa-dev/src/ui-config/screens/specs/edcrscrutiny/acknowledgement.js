import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoHomeFooter } from "./acknowledgementResource/gotoHomeFooter";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import axios from "axios";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResultsfromEDCRWithApplcationNo } from "./functions";
import { downloadPrintContainer } from "./acknowledgementResource/acknowledgementUtils";

const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  tenant,
  reporturl,
  edcrnumber
) => {
  const headerrow = {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: { display: "flex", alignItems: "flex-start" }
    },
    children: {
      header1: getCommonContainer(
        {
          header: getCommonHeader({
            labelName: "New Building Plan Scrutiny",
            labelKey: "EDCR_ACKNOWLEDGEMENT_COMMON_CARD"
          }),
          applicationNumber: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-tradelicence",
            componentPath: "ApplicationNoContainer",
            props: {
              number: applicationNumber
            }
          }
        },
        {
          style: { display: "flex" }
        }
      ),
      buttons: downloadPrintContainer(reporturl)
    }
  };
  if (purpose === "apply" && status === "success") {
    return {
      headerrow,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          // style: {
          //   position: "absolute",
          //   width: "95%"
          // }
        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Building plan eDCR scrutiny is Accepted",
              labelKey: "EDCR_ACKNOWLEDGEMENT_SUCCESS_MESSAGE"
            },
            body: {
              labelName:
                "This plan can now be used for creating permit application",
              labelKey: "EDCR_ACKNOWLEDGEMENT_SUCCESS_COMMENT"
            },
            tailText: {
              labelName: "Building Plan Scrutiny Number",
              labelKey: "EDCR_NUMBER_LABEL"
            },
            number: edcrnumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "apply" && status === "rejected") {
    return {
      headerrow,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Building plan eDCR is Not Accepted",
              labelKey: "EDCR_REJECTION_MESSAGE"
            },
            body: {
              labelName: "Please make corrections in the diagram and try again",
              labelKey: "EDCR_REJECTION_COMMENT"
            }
          })
        }
      },
      gotoHomeFooter
    };
  }
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
    const tenant = getQueryArg(window.location.href, "tenantId");

    getSearchResultsfromEDCRWithApplcationNo(applicationNumber, tenant)
      .then(response => {
        if (response.data.edcrDetail.length > 0) {
          const data = getAcknowledgementCard(
            state,
            dispatch,
            purpose,
            status,
            response.data.edcrDetail[0].applicationNumber,
            tenant,
            response.data.edcrDetail[0].planReport,
            response.data.edcrDetail[0].edcrNumber
          );
          set(action, "screenConfig.components.div.children", data);
          dispatch(
            handleField("acknowledgement", "components.div", "children", data)
          );
        }
      })
      .catch(error => {
        console.error("error while searching " + error.message);
      });
    return action;
  }
};

export default screenConfig;
