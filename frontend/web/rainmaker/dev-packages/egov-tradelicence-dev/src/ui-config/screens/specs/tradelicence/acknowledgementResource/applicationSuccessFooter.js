import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { ifUserRoleExists } from "../../utils";
const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const generatePdfAndDownload = (
  state,
  dispatch,
  action,
  applicationNumber,
  tenant
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
  iframe.src =
    document.location.origin +
    window.basename +
    `/tradelicence/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenant}`;
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

      doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight-50);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(data, "PNG", 5, position+8, imgWidth, imgHeight-50);
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

  // To hide the iframe
  iframe.style.cssText =
    "position: absolute; opacity:0; z-index: -9999; width: 900px; height: 100%";
  document.querySelector("#custom-atoms-iframeForPdf").appendChild(iframe);

  // let iframe = document.querySelector("#custom-containers-local-iframe");
  // let target = iframe.contentDocument.querySelector(
  //   "#material-ui-tradeReviewDetails"
  // );
  // html2canvas(target, {
  //   onclone: function(clonedDoc) {
  //     clonedDoc.getElementById(
  //       "material-ui-tradeReviewDetails"
  //     ).style.display = "block";
  //   }
  // }).then(canvas => {
  //   var data = canvas.toDataURL();
  //   var docDefinition = {
  //     content: [
  //       {
  //         image: data,
  //         width: 500
  //       }
  //     ]
  //   };
  //   if (action === "download") {
  //     pdfMake.createPdf(docDefinition).download("application_summary.pdf");
  //   } else if (action === "print") {
  //     pdfMake.createPdf(docDefinition).print();
  //   }
  // });
};

export const applicationSuccessFooter = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  //const baseURL = getBaseURL();
  const roleExists = ifUserRoleExists("CITIZEN");
  // const redirectionURL = roleExists ? "/tradelicense-citizen/home" : "/inbox";
  /* Mseva 2.0 changes */
  const redirectionURL = roleExists ? "/" : "/inbox";
  return getCommonApplyFooter({
    gotoHome: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "TL_COMMON_BUTTON_HOME"
        })
      },
      onClickDefination: {
        action: "page_change",
        path: redirectionURL
      }
    },
    downloadFormButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadFormButtonLabel: getLabel({
          labelName: "DOWNLOAD CONFIRMATION FORM",
          labelKey: "TL_APPLICATION_BUTTON_DOWN_CONF"
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
            tenant
          );
        }
      },
      visible:false
    },
    printFormButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        printFormButtonLabel: getLabel({
          labelName: "PRINT CONFIRMATION FORM",
          labelKey: "TL_APPLICATION_BUTTON_PRINT_CONF"
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
            tenant
          );
        }
      },
      visible:false
    }
  });
};
