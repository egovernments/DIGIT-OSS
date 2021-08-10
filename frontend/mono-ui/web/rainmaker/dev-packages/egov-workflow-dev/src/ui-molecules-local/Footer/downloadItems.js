import generateReceipt from "egov-ui-framework/ui-config/screens/specs/utils/receiptPdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePdfFromDiv = (action, applicationNumber) => {
  let target = document.querySelector("#custom-atoms-div");
  html2canvas(target, {
    onclone: function(clonedDoc) {
      // clonedDoc.getElementById("custom-atoms-footer")[
      //   "data-html2canvas-ignore"
      // ] = "true";
      clonedDoc.getElementById("custom-atoms-footer").style.display = "none";
    }
  }).then(canvas => {
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
      doc.save(`preview-${applicationNumber}.pdf`);
    } else if (action === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  });
};

export const getDownloadItems = (status, applicationNumber, state) => {
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      generateReceipt("certificate_download", state);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      generateReceipt("certificate_print", state);
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      generateReceipt("receipt_download", state);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      generateReceipt("receipt_print", state);
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      generatePdfFromDiv("download", applicationNumber);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      generatePdfFromDiv("print", applicationNumber);
    },
    leftIcon: "assignment"
  };

  switch (status) {
    case "APPROVED":
      return {
        downloadMenu: [
          tlCertificateDownloadObject,
          receiptDownloadObject,
          applicationDownloadObject
        ],
        printMenu: [
          tlCertificatePrintObject,
          receiptPrintObject,
          applicationPrintObject
        ]
      };

    // case "pending_approval":
    //   return {
    //     downloadMenu: [receiptDownloadObject, applicationDownloadObject],
    //     printMenu: [receiptPrintObject, applicationPrintObject]
    //   };

    default:
      return {
        downloadMenu: [applicationDownloadObject],
        printMenu: [applicationPrintObject]
      };
      break;
  }
};
