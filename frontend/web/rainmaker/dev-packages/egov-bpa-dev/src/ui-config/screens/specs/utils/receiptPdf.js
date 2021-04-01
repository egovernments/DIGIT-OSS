import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import _ from "lodash";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let tableborder = {
  hLineColor: function(i, node) {
    return "#979797";
  },
  vLineColor: function(i, node) {
    return "#979797";
  },
  hLineWidth: function(i, node) {
    return 0.5;
  },
  vLineWidth: function(i, node) {
    return 0.5;
  }
};

let noborder = {
  hLineWidth: function(i, node) {
    return 0;
  },
  vLineWidth: function(i, node) {
    return 0;
  }
};

let borderKey = [true, true, false, true];
let borderValue = [false, true, true, true];
let receiptTableWidth = ["*", "*", "*", "*"];
let payableAmountTable = ["*", "*", "*", "*", "*", "*"];
let payableAmountBorderKey = [true, true, true, true, true, true, true];
let payableInfoTable3 = ["*", "*", "*"];
let accessoriesTable = ["24%", "76%"];

const getReceiptData = (transformedData, ulbLogo) => {
  let owners = transformedData.owners.map(owner => [
    {
      text: "Owner Name",
      border: [true, true, false, true],
      style: "receipt-table-key"
    },
    { text: owner.name, border: [false, true, true, true] },
    {
      text: "Mobile No.",
      border: [true, true, false, true],
      style: "receipt-table-key"
    },
    { text: owner.mobile, border: [false, true, true, true] }
  ]);
  var receiptData = {
    content: [
      {
        style: "tl-head",
        table: {
          widths: [50, "*", 100],
          body: [
            [
              {
                image: ulbLogo,
                width: 50,
                height: 61.25,
                margin: [41, 12, 10, 10]
              },
              {
                //stack is used here to give multiple sections one after another in same body
                stack: [
                  {
                    text: transformedData.corporationName,
                    style: "receipt-logo-header"
                  },
                  {
                    text: "Trade License Payment Receipt (Citizen Copy)",
                    style: "receipt-logo-sub-header"
                  }
                ],
                alignment: "center",
                margin: [56, 23, 0, 0]
              },
              {
                text: [
                  {
                    text: `Receipt No.\n ${transformedData.receiptNumber}`,
                    bold: true,
                    style: "receipt-no"
                  }
                ],
                alignment: "center",
                margin: [-50, 30, 0, 2]
              }
            ]
          ]
        },
        layout: noborder
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Application Type ",
                bold: true
              },
              {
                text: transformedData.applicationType,
                bold: false
              }
            ],

            alignment: "left"
          },
          {
            text: [
              {
                text: "Old License No. ",
                bold: true
              },
              {
                text: transformedData.oldLicenseNumber,
                bold: false
              }
            ],
            alignment: "right"
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Application No. ",
                bold: true
              },
              {
                text: transformedData.applicationNumber,
                bold: false
              }
            ],

            alignment: "left"
          },
          {
            text: [
              {
                text: "Receipt No. ",
                bold: true
              },
              {
                text: transformedData.receiptNumber,
                bold: false
              }
            ],
            alignment: "right"
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Financial Year ",
                bold: true
              },
              {
                text: transformedData.financialYear,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Payment Date ",
                bold: true
              },
              {
                text: transformedData.paymentDate,
                bold: false
              }
            ],
            alignment: "right"
          }
        ]
      },
      { text: "TRADE DETAILS", style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: [
            [
              {
                text: "Trade Name",
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.tradeName, border: borderValue },
              {
                text: "Trade Category",
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: transformedData.tradeCategory,
                border: borderValue
              }
            ]
          ]
        },
        layout: tableborder
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: accessoriesTable,
          body: [
            [
              {
                text: "Trade Type",
                border: [true, false, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.tradeTypeReceipt,
                border: [false, false, true, true]
              }
            ],
            [
              {
                text: "Accessories",
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: `${transformedData.accessoriesList}`,
                border: borderValue
              }
            ]
          ]
        },
        layout: tableborder
      },
      { text: "TRADE LOCATION DETAILS", style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: [
            [
              {
                text: "House/Door No.",
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.doorNo, border: borderValue },
              {
                text: "Building/Colony Name.",
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: transformedData.buildingName,
                border: borderValue
              }
            ],
            [
              {
                text: "Street Name",
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.streetName, border: borderValue },
              {
                text: "Locality/Mohalla",
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: transformedData.locality,
                border: borderValue
              }
            ]
          ]
        },
        layout: tableborder
      },
      { text: "OWNERSHIP INFORMATION", style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: owners
        },
        layout: tableborder
      },
      { text: "PAYABLE AMOUNT", style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: payableAmountTable,
          body: [
            [
              {
                text: "Trade License Fee",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: "Penalty",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: "Rebate",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: "Adhoc Penalty",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: "Adhoc Rebate",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: "Total",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              }
            ],
            [
              {
                text: transformedData.tlFee,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              },
              {
                text: transformedData.tlPenalty,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              },
              {
                text: transformedData.tlRebate,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              },
              {
                text: transformedData.tlAdhocPenalty,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              },
              {
                text: transformedData.tlAdhocRebate,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              },
              {
                text: transformedData.totalAmount,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              }
            ]
          ]
        },
        layout: tableborder
      },
      { text: "PAYMENT INFORMATION", style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: [
            [
              {
                text: "Total Amount Paid:",
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.amountPaid, border: borderValue },
              {
                text: "Amount Due:",
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: transformedData.amountDue,
                border: borderValue
              }
            ]
          ]
        },
        layout: tableborder
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: payableInfoTable3,
          body: [
            [
              {
                text: "Payment Mode",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: "Transaction ID/ Cheque/ DD No.",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: "Bank Name & Branch",
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              }
            ],
            [
              {
                text: transformedData.paymentMode,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              },
              {
                text: transformedData.transactionNumber,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              },
              {
                text: transformedData.bankAndBranch,
                border: payableAmountBorderKey,
                style: "receipt-table-value",
                alignment: "center"
              }
            ]
          ]
        },
        layout: tableborder
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: [
            [
              {
                text: "G8 Receipt No:",
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.g8ReceiptNo, border: borderValue },
              {
                text: "G8 Receipt Issue Date:",
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: transformedData.g8ReceiptDate,
                border: borderValue
              }
            ]
          ]
        },
        layout: tableborder
      },
      {
        style: "receipt-approver",
        columns: [
          {
            text: [
              {
                text: "Generated by: ",
                bold: true
              },
              {
                text: transformedData.auditorName,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Commissioner/EO",
                bold: true
              }
            ],
            alignment: "right"
          }
        ]
      }
    ],
    footer: [
      {
        text:
          "Note:\n1. Payment received by cheque/demand draft shall be subject to realization.\n2. This document is not a proof of Property Ownership.\n3. This is a computer generated document, hence requires no signature.",
        style: "receipt-footer"
      }
    ],
    styles: {
      "tl-head": {
        fillColor: "#F2F2F2",
        margin: [-41, -41, -41, 0]
      },
      "pt-reciept-citizen-header": {
        fontSize: 12,
        bold: true,
        margin: [0, 8, 0, 0], //left top right bottom
        color: "#484848"
      },
      "pt-reciept-citizen-subheader": {
        fontSize: 10,
        bold: true,
        margin: [0, 16, 0, 8], //left top right bottom
        color: "#484848"
      },
      "pt-reciept-citizen-table": {
        fontSize: 10,
        color: "#484848"
      },
      "receipt-assess-table": {
        fontSize: 10,
        color: "#484848",
        margin: [0, 8, 0, 0]
      },
      "receipt-assess-table-header": {
        bold: true,
        fillColor: "#D8D8D8",
        color: "#484848"
      },
      "receipt-header-details": {
        fontSize: 9,
        margin: [0, 0, 0, 8],
        color: "#484848"
      },
      "receipt-table-key": {
        color: "#484848",
        bold: true
      },
      "receipt-table-value": {
        color: "#484848"
      },
      "receipt-logo-header": {
        color: "#484848",
        fontFamily: "Roboto",
        fontSize: 16,
        bold: true,
        letterSpacing: 0.74
      },
      "receipt-logo-sub-header": {
        color: "#484848",
        fontFamily: "Roboto",
        fontSize: 13,
        letterSpacing: 1.6,
        margin: [0, 6, 0, 0]
      },
      "receipt-footer": {
        color: "#484848",
        fontSize: 8,
        margin: [30, -20, 0, 0]
      },
      "receipt-no": {
        color: "#484848",
        fontSize: 10
      },
      "receipt-approver": {
        fontSize: 10,
        bold: true,
        margin: [0, 60, 0, 8], //left top right bottom
        color: "#484848"
      }
    }
  };
  return receiptData;
};

const getCertificateData = (transformedData, ulbLogo) => {
  var tlCertificateData = {
    content: [
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                stack: [
                  {
                    image: ulbLogo,
                    width: 50,
                    height: 61.25,
                    alignment: "center"
                  },
                  {
                    text: transformedData.corporationName,
                    style: "receipt-logo-header",
                    margin: [0, 10, 0, 0]
                  },
                  {
                    text: `${transformedData.corporationAddress}\nContact : ${
                      transformedData.corporationContact
                    }\nWebsite : ${
                      transformedData.corporationWebsite
                    }\nEmail : ${transformedData.corporationEmail}`,
                    style: "receipt-logo-sub-text",
                    margin: [0, 8, 0, 0]
                  },
                  {
                    text: "TRADE LICENSE CERTIFICATE",
                    style: "receipt-logo-sub-header",
                    margin: [0, 30, 0, 0]
                  }
                ],
                alignment: "center",
                margin: [0, 0, 0, 0]
              }
            ]
          ]
        },
        layout: noborder
      },
      {
        style: "tl-certificate-data",
        columns: [
          {
            width: 160,
            text: "Trade License Number"
          },
          {
            width: "*",
            text: transformedData.licenseNumber
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Application Number"
          },
          {
            width: "*",
            text: transformedData.applicationNumber
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Receipt Number"
          },
          {
            width: "*",
            text: transformedData.receiptNumber
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Financial Year"
          },
          {
            width: "*",
            text: transformedData.financialYear
          }
        ]
      },
      {
        style: "tl-certificate-data",
        columns: [
          {
            width: 160,
            text: "Trade Name"
          },
          {
            width: "*",
            text: transformedData.tradeName
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Trade Owner Name"
          },
          {
            width: "*",
            text: transformedData.ownersList
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Trade Owner Contact"
          },
          {
            width: "*",
            text: transformedData.owners[0].mobile
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Trade Address"
          },
          {
            width: "*",
            text: transformedData.address
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Trade Type"
          },
          {
            width: "*",
            text: transformedData.tradeTypeCertificate
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Accessories"
          },
          {
            width: "*",
            text: `${transformedData.accessoriesList}`
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "Trade License Fee"
          },
          {
            width: "*",
            text: `Rs. ${transformedData.totalAmount}`
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "License Issue Date"
          },
          {
            width: "*",
            text: transformedData.licenseIssueDate
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: "License Validity"
          },
          {
            width: "*",
            text: `${transformedData.licenseValidity.startDate} to ${
              transformedData.licenseValidity.endDate
            } `
          }
        ]
      },
      {
        style: "tl-certificate-footer",
        columns: [
          {
            text: [
              {
                text: "Approved by: "
              },
              {
                text: transformedData.auditorName
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Commissioner/EO",
                bold: false
              }
            ],
            alignment: "right"
          }
        ]
      }
    ],
    footer: [
      {
        text:transformedData.Disclaimer,
        style: "receipt-footer"
      }
    ],
    //define all the styles here
    styles: {
      "pt-reciept-citizen-header": {
        fontSize: 14,
        margin: [0, 24, 0, 0], //left top right bottom
        color: "#1E1E1E"
      },
      "tl-certificate-data": {
        fontSize: 14,
        margin: [0, 40, 0, 0], //left top right bottom
        color: "#1E1E1E"
      },
      "tl-certificate-data-2": {
        fontSize: 14,
        margin: [0, 8, 0, 0], //left top right bottom
        color: "#1E1E1E"
      },
      "pt-reciept-citizen-subheader": {
        fontSize: 10,
        bold: true,
        margin: [0, 16, 0, 8], //left top right bottom
        color: "#484848"
      },
      "pt-reciept-citizen-table": {
        fontSize: 10,
        color: "#484848"
      },
      "receipt-assess-table": {
        fontSize: 10,
        color: "#484848",
        margin: [0, 8, 0, 0]
      },
      "receipt-assess-table-header": {
        bold: true,
        fillColor: "#D8D8D8",
        color: "#484848"
      },
      "receipt-header-details": {
        fontSize: 9,
        margin: [0, 0, 0, 8],
        color: "#484848"
      },
      "receipt-table-key": {
        color: "#484848",
        bold: true
      },
      "receipt-table-value": {
        color: "#484848"
      },
      "receipt-logo-header": {
        color: "#1E1E1E",
        fontFamily: "Roboto",
        fontSize: 18,
        bold: true,
        letterSpacing: 0.74
      },
      "receipt-logo-sub-text": {
        color: "#656565",
        fontFamily: "Roboto",
        fontSize: 14,
        letterSpacing: 0.74
      },
      "receipt-logo-sub-header": {
        color: "#1E1E1E",
        fontFamily: "Roboto",
        fontSize: 16,
        letterSpacing: 1.6,
        bold: true
      },
      "receipt-footer": {
        color: "#484848",
        fontSize: 8,
        margin: [10, -25, 5, 5]
      },
      "receipt-no": {
        color: "#484848",
        fontSize: 10
      },
      "tl-certificate-footer": {
        fontSize: 14,
        margin: [0, 50, 0, 0], //left top right bottom
        color: "#1E1E1E"
      }
    }
  };
  return tlCertificateData;
};

const generateReceipt = async (state, dispatch, type) => {
  let data1 = _.get(
    state.screenConfiguration.preparedFinalObject,
    "applicationDataForReceipt",
    {}
  );
  let data2 = _.get(
    state.screenConfiguration.preparedFinalObject,
    "receiptDataForReceipt",
    {}
  );
  let data3 = _.get(
    state.screenConfiguration.preparedFinalObject,
    "mdmsDataForReceipt",
    {}
  );
  let data4 = _.get(
    state.screenConfiguration.preparedFinalObject,
    "userDataForReceipt",
    {}
  );
  let ulbLogo = _.get(
    state.screenConfiguration.preparedFinalObject,
    "base64UlbLogo",
    ""
  );
  if (_.isEmpty(data1)) {
    console.log("Error in application data");
    return;
  } else if (_.isEmpty(data2)) {
    console.log("Error in receipt data");
    return;
  } else if (_.isEmpty(data3)) {
    console.log("Error in mdms data");
    return;
  } else if (_.isEmpty(data4)) {
    console.log("Error in auditor user data");
    return;
  } else if (_.isEmpty(ulbLogo)) {
    console.log("Error in image data");
    return;
  }
  let transformedData = {
    ...data1,
    ...data2,
    ...data3,
    ...data4
  };
  switch (type) {
    case "certificate_download":
      let certificate_data = getCertificateData(transformedData, ulbLogo);
      certificate_data &&
        pdfMake.createPdf(certificate_data).download("tl_certificate.pdf");
      break;
    case "certificate_print":
      certificate_data = getCertificateData(transformedData, ulbLogo);
      certificate_data && pdfMake.createPdf(certificate_data).print();
      break;
    case "receipt_download":
      let receipt_data = getReceiptData(transformedData, ulbLogo);
      receipt_data &&
        pdfMake.createPdf(receipt_data).download("tl_receipt.pdf");
      break;
    case "receipt_print":
      receipt_data = getReceiptData(transformedData, ulbLogo);
      receipt_data && pdfMake.createPdf(receipt_data).print();
      break;
    default:
      break;
  }
};

export default generateReceipt;
