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

const getPDFbuttons = (
  state,
  dispatch,
  applicationNumber,
  tenant,
  reporturl
) => {
  return {
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

            props: {
              iconName: "cloud_download",
              style: {
                marginTop: "7px",
                marginRight: "8px",
                cursor: "pointer"
              }
            },
            onClick: {
              action: "condition",
              callBack: () => {
                generatePdfAndDownload(
                  state,
                  dispatch,
                  "download",
                  applicationNumber,
                  tenant,
                  reporturl
                );
              }
            }
          },
          div2: getLabel({
            labelName: "Scrutiny Report",
            labelKey: "EDCR_SCUTINY_REPORT",
            style: {
              cursor: "pointer"
            }
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: () => {
            generatePdfAndDownload(
              state,
              dispatch,
              "download",
              applicationNumber,
              tenant,
              reporturl
            );
          }
        }
      },
      PrintFormButton: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          div1: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",

            props: {
              iconName: "local_printshop",
              style: {
                marginTop: "7px",
                marginRight: "8px",
                marginLeft: "10px",
                cursor: "pointer"
              }
            },
            onClick: {
              action: "condition",
              callBack: () => {
                generatePdfAndDownload(
                  state,
                  dispatch,
                  "print",
                  applicationNumber,
                  tenant,
                  reporturl
                );
              }
            }
          },
          div2: getLabel({
            labelName: "Scrutiny Report",
            labelKey: "EDCR_SCUTINY_REPORT",
            style: {
              cursor: "pointer"
            }
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: () => {
            generatePdfAndDownload(
              state,
              dispatch,
              "print",
              applicationNumber,
              tenant,
              reporturl
            );
          }
        }
      }
    },
    props: {
      style: {
        display: "flex"
      }
    }
  };
};
const generatePdfAndDownload = async (
  state,
  dispatch,
  action,
  applicationNumber,
  tenant,
  reporturl
) => {
  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "Preparing confirmation form, please wait...",
        labelKey: "ERR_PREPARING_CONFIRMATION_FORM"
      },
      "info"
    )
  );

  if (action === "print") {
    var response = await axios.get(reporturl, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf"
      }
    });
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    var myWindow = window.open(fileURL);
    if (myWindow != undefined) {
      myWindow.addEventListener('load', (event) => {
        setTimeout(function() {
          myWindow.focus();
          myWindow.print();
        }, 2000)
      });
    }
  } else if (action === "download") {
    var iframe = document.createElement("iframe");
    iframe.src = reporturl;
    var hasIframeLoaded = false,
      hasEstimateLoaded = false;
    iframe.onload = function(e) {
      hasIframeLoaded = true;
      if (hasEstimateLoaded) {
        downloadConfirmationForm();
      }
    };
    window.document.addEventListener("estimateLoaded", handleEvent, false);
    function handleEvent(e) {
      if (e.detail && iframe.contentDocument) {
        hasEstimateLoaded = true;
        if (hasIframeLoaded) {
          downloadConfirmationForm();
        }
      }
    }
    function downloadConfirmationForm() {
      let target = iframe.contentDocument.querySelector(
        "#material-ui-tradeReviewDetails"
      );
    }

    // To hide the iframe
    iframe.style.cssText =
      "position: absolute; opacity:0; z-index: -9999; width: 900px; height: 100%";
    document.querySelector("#custom-atoms-iframeForPdf").appendChild(iframe);
  }
};

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
  if (purpose === "apply" && status === "success") {
    return {
      header: getCommonContainer({
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
      }),
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
              labelName:"This plan can now be used for creating permit application",
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
      abs: getPDFbuttons(state, dispatch, applicationNumber, tenant, reporturl),
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      gotoHomeFooter
    };
  } else if (purpose === "apply" && status === "rejected") {
    return {
      header: getCommonContainer({
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
      }),
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
              labelName:"Please make corrections in the diagram and try again",
              labelKey: "EDCR_REJECTION_COMMENT"
            }
          })
        }
      },
      abs: getPDFbuttons(state, dispatch, applicationNumber, tenant, reporturl),
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
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
            applicationNumber,
            tenant,
            response.data.edcrDetail[0].planReport,
            response.data.edcrDetail[0].edcrNumber
          );
          // set(action, "screenConfig.components.div.children", data);
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
