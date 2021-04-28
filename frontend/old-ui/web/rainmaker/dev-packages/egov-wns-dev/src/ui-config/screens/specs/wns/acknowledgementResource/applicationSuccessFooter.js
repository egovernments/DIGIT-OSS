import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { ifUserRoleExists } from "../../utils";
import { downloadApp } from '../../../../../ui-utils/commons';
import get from 'lodash/get';
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { generateWSAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generateWSAcknowledgement";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import cloneDeep from "lodash/cloneDeep";
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

const getCommonDownloadPrint = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: { textAlign: "right", display: "flex" }
    },
    children
  };
};

const generatePdfAndDownload = (
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
    `/wns/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenant}`;
  var hasIframeLoaded = false,
    hasEstimateLoaded = false;
  iframe.onload = function (e) {
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
    html2canvas(target).then(function (canvas) {
      document.querySelector("#custom-atoms-iframeForPdf").removeChild(iframe);
      var data = canvas.toDataURL("image/jpeg", 1);
      var imgWidth = 200;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF("p", "mm");
      var position = 0;

      doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
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

const handleAppDownloadAndPrint = async(state, dispatch, action) => {
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const applicationNumberWater = getQueryArg(window.location.href, "applicationNumberWater");
  const applicationNumberSewerage = getQueryArg(window.location.href, "applicationNumberSewerage");
  const { WaterConnection, DocumentsData,SewerageConnection} = state.screenConfiguration.preparedFinalObject;

  let filteredDocs = DocumentsData;
  filteredDocs && filteredDocs.map(val => {
    if (val.title.includes("WS_OWNER.IDENTITYPROOF.")) { val.title = "WS_OWNER.IDENTITYPROOF"; }
    else if (val.title.includes("WS_OWNER.ADDRESSPROOF.")) { val.title = "WS_OWNER.ADDRESSPROOF"; }
  });
  if (applicationNumberWater && applicationNumberSewerage) {
    WaterConnection[0].pdfDocuments = filteredDocs;
    SewerageConnection[0].pdfDocuments = filteredDocs;
    let WSstoreData=cloneDeep(WaterConnection);
    let connTypeSewerage=SewerageConnection[0].connectionType;
    let connTypeWater=WaterConnection[0].connectionType;
    const WSRequestBody = cloneDeep(get(
      state,
      "screenConfiguration.preparedFinalObject", {}));
      let fileName=action==="print"?"print":"application.pdf";
      dispatch(prepareFinalObject("WaterConnection[0]", WSstoreData[0]));
      let connType=connTypeWater===null?"Metered":connTypeWater;
    var cc = await generateWSAcknowledgement(WSRequestBody, fileName,"WATER",connType);
   
    if(cc){
      const { SewerageConnection } = state.screenConfiguration.preparedFinalObject;
      dispatch(prepareFinalObject("WaterConnection[0]", SewerageConnection[0]));
      let SWRequestBody=cloneDeep(get(
        state,
        "screenConfiguration.preparedFinalObject", {}));
         fileName=action==="print"?"print":"sewerage-application.pdf";
      cc = await generateWSAcknowledgement(SWRequestBody, fileName,"SEWERAGE",connTypeSewerage);
      if(cc){
        dispatch(prepareFinalObject("WaterConnection[0]", WSstoreData[0]));        
      }
    }
  } else if (applicationNumber) {
 
    if (applicationNumber.includes("WS")) {
      let connTypeWater=WaterConnection[0].connectionType;
      let water=cloneDeep(get(
        state,
        "screenConfiguration.preparedFinalObject", {}))
         let fileName=action==="print"?"print":"application.pdf";
         let connType=connTypeWater===null?"Metered":connTypeWater;
      cc=generateWSAcknowledgement(water, fileName,"WATER",connType);
    } else if (applicationNumber.includes("SW")) {
      let connTypeSewerage=SewerageConnection[0].connectionType;
      let SWstoreData=cloneDeep(SewerageConnection);
      dispatch(prepareFinalObject("WaterConnection[0]", SWstoreData[0]));
      let SWRequestBody=cloneDeep(get(
        state,
        "screenConfiguration.preparedFinalObject", {}));
        let fileName=action==="print"?"print":"sewerage-application.pdf";
      cc = generateWSAcknowledgement(SWRequestBody, fileName,"SEWERAGE",connTypeSewerage);
    }
  }
}



export const DownloadAndPrint = (state,
  dispatch,
  applicationNumber,
  tenant) => {
  return getCommonDownloadPrint({
    downloadFormButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "160px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadFormButtonLabel: getLabel({
          labelName: "DOWNLOAD CONFIRMATION FORM",
          labelKey: "WS_COMMON_BUTTON_DOWNLOAD"
          // labelKey: "WS_APPLICATION_BUTTON_DOWN_CONF"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: () => { handleAppDownloadAndPrint(state, dispatch, "download") }
      }
    },
    printFormButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "160px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        printFormButtonLabel: getLabel({
          labelName: "PRINT CONFIRMATION FORM",
          labelKey: "WS_COMMON_BUTTON_PRINT"
          // labelKey: "WS_APPLICATION_BUTTON_PRINT_CONF"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: () => { handleAppDownloadAndPrint(state, dispatch, "print") }
      }
    }
  })

}

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
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "15%",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "HOME",
          labelKey: "WS_COMMON_BUTTON_HOME"
        })
      },
      onClickDefination: {
        action: "page_change",
        path: redirectionURL
      }
    },
  });
};
