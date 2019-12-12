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

const generatePdfAndDownload = (
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
    html2canvas(target).then(function(canvas) {
      document.querySelector("#custom-atoms-iframeForPdf").removeChild(iframe);
      var data = canvas.toDataURL("image/jpeg", 1);
      var imgWidth = 200;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF("p", "mm");
      var position = 0;

      doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight - 50);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(data, "PNG", 5, position + 8, imgWidth, imgHeight - 50);
        heightLeft -= pageHeight;
      }
      if (action === "download") {
        doc.save(`application_summary_${applicationNumber}.pdf`);
      } else if (action === "print") {
        doc.autoPrint();
        window.open(doc.output("bloburl"), "_blank");
      }
    });
  }
  iframe.style.cssText =
    "position: absolute; opacity:0; z-index: -9999; width: 900px; height: 100%";
  document.querySelector("#custom-atoms-iframeForPdf").appendChild(iframe);
};

const getSearchResultsfromEDCR = async (applicationNumber, tenantId) => {
  try {
    const response = await axios.post(
      `https://egov-dcr-galaxy.egovernments.org/edcr/rest/dcr/scrutinydetails?tenantId=${tenantId}&transactionNumber=${applicationNumber}`,
      {
        RequestInfo: {
          apiId: "1",
          ver: "1",
          ts: "01-01-2017 01:01:01",
          action: "create",
          did: "jh",
          key: "",
          msgId: "gfcfc",
          correlationId: "wefiuweiuff897",
          authToken: "",
          userInfo: {
            id: 1,
            tenantId: "generic"
          }
        }
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fileprintdownload = {
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
              marginRight: "8px"
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
          labelKey: "EDCR_SCUTINY_REPORT"
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
              marginLeft: "10px"
            }
          },
          onClick: {
            action: "condition",
            callBack: () => {
              generatePdfAndDownload(
                state,
                dispatch,
                "print",
                reporturl,
                tenant
              );
            }
          }
        },
        div2: getLabel({
          labelName: "Scrutiny Report",
          labelKey: "EDCR_SCUTINY_REPORT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: () => {
          generatePdfAndDownload(state, dispatch, "print", reporturl, tenant);
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
              labelName: "Building Plan Scrutiny is Processed",
              labelKey: "EDCR_ACKNOWLEDGEMENT_SUCCESS_MESSAGE"
            },
            tailText: {
              labelName: "Building Plan Scrutiny Number",
              labelKey: "EDCR_NUMBER_LABEL"
            },
            number: edcrnumber
          })
        }
      },
      fileprintdownload,
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
              labelName: "Building Plan Scrutiny is Rejected",
              labelKey: "EDCR_REJECTION_MESSAGE"
            }
          })
        }
      },
      fileprintdownload,
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

    getSearchResultsfromEDCR(applicationNumber, tenant)
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
