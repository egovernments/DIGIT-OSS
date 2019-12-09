import pdfMakeCustom from "pdfmake/build/pdfmake";
import {getLocaleLabels} from "egov-ui-framework/ui-utils/commons.js";
import _ from "lodash";
import {getMessageFromLocalization} from "./receiptTransformer";
import pdfFonts from "./vfs_fonts";
// pdfMakeCustom.vfs = pdfFonts.vfs;
import {
  getLocale
} from "egov-ui-kit/utils/localStorageUtils";
import { from } from "rxjs";


// pdfMakeCustom.fonts = {
//   Camby:{
//           normal: 'Cambay-Regular.ttf',
//           bold: 'Cambay-Regular.ttf',
//           italics: 'Cambay-Regular.ttf',
//           bolditalics: 'Cambay-Regular.ttf'
//   },

// };


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

const getLocaleForTradeType = (tradeType)=>{
  if(tradeType && tradeType.split("/").length){
    const tradeTypeSplitted = tradeType.toUpperCase().split("/");
    if(tradeTypeSplitted.length===3){
      return getLocaleLabels("NA", (tradeTypeSplitted[0].trim())) + "/"+ 
      getLocaleLabels("NA", (tradeTypeSplitted[1].trim())) +"/"+ 
      getLocaleLabels("NA", (tradeTypeSplitted[2].trim().trim()));
    } else {
      return getLocaleLabels("NA", (tradeTypeSplitted[0].trim())) + "/"+ 
      getLocaleLabels("NA", (tradeTypeSplitted[1].trim()));
    }
  } else {
    return tradeType;
  }
}

const getAssesories = (accessories) => {
  if(accessories){
    const splittedAccessories = accessories.split("(");
  return splittedAccessories.length ? getLocaleLabels("NA",splittedAccessories[0])+"("+splittedAccessories[1]: "NA"
  }else{
    return "NA"
  }
}

const getCorporationName = (corporationName, actualAddress) => {
  if(corporationName){
    //const splittedName = corporationName.split(" ");
    return getLocaleLabels("TL_LOCALIZATION_ULBGRADE_MC1","TL_LOCALIZATION_ULBGRADE_MC1")+" "+ getLocaleLabels("TENANT_TENANTS_"+actualAddress.tenantId.replace('.','_').toUpperCase(),"TENANT_TENANTS_"+actualAddress.tenantId.replace('.','_').toUpperCase());
  } else {
    return "NA"
  }
}

const getReceiptData = (transformedData, ulbLogo) => {
  let owners = transformedData.owners.map(owner => [
    {
      text: getLocaleLabels("Owner Name","TL_LOCALIZATION_OWNER_NAME"),
      border: [true, true, false, true],
      style: "receipt-table-key"
    },
    { 
    text:owner.name  },
    
    {
      text: getLocaleLabels("Owner Mobile","TL_LOCALIZATION_OWNER_MOBILE"),
      border: [true, true, false, true],
      style: "receipt-table-key"
    },
    { text:owner.mobile, }
  ]);
  var receiptData = {
    defaultStyle: {
      font: "Camby"
     },
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
                    text: getCorporationName(transformedData.corporationName, transformedData.actualAddress),
                    style: "receipt-logo-header"
                  },
                  {
                    text: getLocaleLabels("Trade License Payment reciept","TL_LOCALIZATION_PAYMENT_RECIEPT"),
                    style: "receipt-logo-sub-header"
                  }
                ],
                alignment: "center",
                margin: [56, 23, 0, 0]
              },
              {
                text: [
                  {
               //     text: `Receipt No.\n ${transformedData.receiptNumber}`,
               text : getLocaleLabels("Receipt No.","TL_LOCALIZATION_RECIEPT_NO") + transformedData.receiptNumber,
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
                text: getLocaleLabels("Application Type","TL_LOCALIZATION_APPLICATION_TYPE"),
                bold: true
              },
              {
                text: getLocaleLabels("TL_LOCALIZATION_" + (transformedData.applicationType).replace('.','_'),"TL_LOCALIZATION_" + (transformedData.applicationType).replace('.','_')),
                bold: false
              }
            ],

            alignment: "left"
          },
          {
            text: [
              {
                text: getLocaleLabels("Old License No.","TL_LOCALIZATION_OLD_LICENSE_NO"),
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
                text: getLocaleLabels("Application No.","TL_LOCALIZATION_APPLICATION_NO"),
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
                text: getLocaleLabels("Reciept No.","TL_LOCALIZATION_RECIEPT_NO"),
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
                text: getLocaleLabels("Financial Year","TL_LOCALIZATION_FINANCIAL_YEAR"),
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
                text: getLocaleLabels("Payment Date","TL_LOCALIZATION_PAYMENT_DATE"),
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
      { text: getLocaleLabels("Trade Details","TL_LOCALIZATION_TRADE_DETAILS"), style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: [
            [
              {
                text: getLocaleLabels(" Trade Name","TL_LOCALIZATION_TRADE_NAME"),
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.tradeName, border: borderValue },
              {
                text:getLocaleLabels("Trade Category","TL_LOCALIZATION_TRADE_CATEGORY"),
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: getLocaleLabels("NA",transformedData.tradeCategory),
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
                text: getLocaleLabels("Trade Type","TL_LOCALIZATION_TRADE_TYPE"),
                border: [true, false, false, true],
                style: "receipt-table-key"
              },
              {
                text: getLocaleForTradeType(transformedData.tradeTypeReceipt),
                border: [false, false, true, true]
              }
            ],
            [
              {
                text: getLocaleLabels("Accessories","TL_LOCALIZATION_ACCESSORIES"),
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: getAssesories(transformedData.accessoriesList),
                border: borderValue
              }
            ]
          ]
        },
        layout: tableborder
      },
      { text: getLocaleLabels("Trade Category","TL_LOCALIZATION_TRADE_CATEGORY"), style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: [
            [
              {
                text: getLocaleLabels("House Door No.","TL_LOCALIZATION_HOUSE_DOOR_NO"),
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.doorNo, 
                border: borderValue 
              },
              {
                text: getLocaleLabels("Building Name","TL_LOCALIZATION_BUILDING_NAME"),
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
                text: getLocaleLabels("Street Name","TL_LOCALIZATION_STREET_NAME"),
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.streetName, border: borderValue },
              {
                text: getLocaleLabels("Locality","TL_LOCALIZATION_LOCALITY"),
                border: borderKey,
                style: "receipt-table-key"
              },
              {
                text: getLocaleLabels("NA",(transformedData.actualAddress.tenantId.replace('.','_')+'_REVENUE_'+transformedData.actualAddress.locality.code).toUpperCase())+" "+getLocaleLabels("NA", transformedData.city),
                border: borderValue
              }
            ]
          ]
        },
        layout: tableborder
      },
      { text: getLocaleLabels("Ownership Information","TL_LOCALIZATION_OWNERSHIP_INFORMATION"), style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: owners
        },
        layout: tableborder
      },
      { text: getLocaleLabels("Payable Amount","TL_LOCALIZATION_PAYABLE_AMOUNT"), style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: payableAmountTable,
          body: [
            [
              {
                text: getLocaleLabels("Trade License Fee","TL_LOCALIZATION_TRADE_LICENSE_FEE"),
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: getLocaleLabels("Penalty","TL_LOCALIZATION_PENALTY"),
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: getLocaleLabels("Rebate","TL_LOCALIZATION_REBATE"),
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: getLocaleLabels("Adhoc Penalty","TL_LOCALIZATION_ADHOC_PENALTY"),
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: getLocaleLabels("Adhoc Rebate","TL_LOCALIZATION_ADHOC_REBATE"),
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: getLocaleLabels("Total","TL_LOCALIZATION_TOTAL"),
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
      { text: getLocaleLabels("Payment Information","TL_LOCALIZATION_PAYMENT_INFORMATION"), style: "pt-reciept-citizen-subheader" },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,
          body: [
            [
              {
                text: getLocaleLabels("Total Amount Paid:","TL_LOCALIZATION_TOTAL_AMOUNT_PAID"),
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.amountPaid, border: borderValue },
              {
                text: getLocaleLabels("Amount Due:","TL_LOCALIZATION_AMOUNT_DUE"),
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
                text: getLocaleLabels("Payment Mode","TL_LOCALIZATION_PAYMENT_MODE"),
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: getLocaleLabels("Transaction ID/ Cheque/ DD No.","TL_LOCALIZATION_TRANSACTION_ID"),
                border: payableAmountBorderKey,
                style: "receipt-table-key",
                alignment: "center"
              },
              {
                text: getLocaleLabels("Bank Name & Branch","TL_LOCALIZATION_BANK_NAME_WITH_BRANCH"),
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
                text: getLocaleLabels("G8 Receipt No:","TL_LOCALIZATION_G8_RECEIPT_NO"),
                border: borderKey,
                style: "receipt-table-key"
              },
              { text: transformedData.g8ReceiptNo, border: borderValue },
              {
                text: getLocaleLabels("G8 Receipt Issue Date:","TL_LOCALIZATION_G8_RECEIPT_ISSUE_DATE"),
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
                text: getLocaleLabels("Generated By:","TL_LOCALIZATION_GENERATED_BY"),
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
                text: getLocaleLabels("Commissioner/EO","TL_LOCALIZATION_COMMISSIONER_OR_EO"),
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
          getLocaleLabels("Note:\n1. Payment received by cheque/demand draft shall be subject to realization.\n2. This document is not a proof of Property Ownership.\n3. This is a computer generated document, hence requires no signature.","TL_LOCALIZATION_NOTE"),
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
      //  fontFamily: fontName,
        fontSize: 16,
        bold: true,
        letterSpacing: 0.74
      },
      "receipt-logo-sub-header": {
        color: "#484848",
      //  fontFamily: fontName,
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
console.log(transformedData);
  var tlCertificateData = {
    defaultStyle: {
      font: "Camby"
     },
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
                    text: getCorporationName(transformedData.corporationName, transformedData.actualAddress),
                    style: "receipt-logo-header",
                    margin: [0, 10, 0, 0],
                   // font:"Roboto"
                  },
                  {
                    text: getLocaleLabels("TL_LOCALIZATION_CORPORATION_ADDRESS","TL_LOCALIZATION_CORPORATION_ADDRESS")+ "\n" + getLocaleLabels("Contact : ","TL_LOCALIZATION_CORPORATION_CONTACT") + 
                      transformedData.corporationContact +
                      "\n" +getLocaleLabels("Website : ","TL_LOCALIZATION_CORPORATION_WEBSITE") +
                      transformedData.corporationWebsite +
                      "\n" +getLocaleLabels("Email : ","TL_LOCALIZATION_CORPORATION_EMAIL") + transformedData.corporationEmail,
                    style: "receipt-logo-sub-text",
                    margin: [0, 8, 0, 0],
                   
                  },
                  {
                    text: getLocaleLabels("TRADE LICENSE CERTIFICATE","TL_LOCALIZATION_TRADE_LICENSE_CERTIFICATE"),
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
            text: getLocaleLabels("Trade License Number","TL_LOCALIZATION_TRADE_LICENSE_NO")
          },
          {
            width: "*",
            text: transformedData.licenseNumber,
           
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Application Number","TL_LOCALIZATION_APPLICATION_NO")
          },
          {
            width: "*",
            text: transformedData.applicationNumber,
            
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Receipt Number","TL_LOCALIZATION_RECIEPT_NO")
          },
          {
            width: "*",
            text: transformedData.receiptNumber,
    
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Financial Year","TL_LOCALIZATION_FINANCIAL_YEAR")
          },
          {
            width: "*",
            text: transformedData.financialYear,
     
          }
        ]
      },
      {
        style: "tl-certificate-data",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Trade Name","TL_LOCALIZATION_TRADE_NAME")
          },
          {
            width: "*",
            text: transformedData.tradeName,
         //  font: "Roboto"
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Trade Owner Name","TL_LOCALIZATION_TRADE_OWNER_NAME")
          },
          {
            width: "*",
            text: transformedData.ownersList,
         //   font: "Roboto"
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Trade Owner Contact","TL_LOCALIZATION_TRADE_OWNER_CONTACT")
          },
          {
            width: "*",
            text: transformedData.owners[0].mobile,
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Trade Address","TL_LOCALIZATION_TRADE_ADDRESS")
          },
          {
            width: "*",
            //text: transformedData.address
            text:getLocaleLabels("NA",(transformedData.actualAddress.tenantId.replace('.','_')+'_REVENUE_'+transformedData.actualAddress.locality.code).toUpperCase())+" "+getLocaleLabels("NA", transformedData.city)

        //    font: "Roboto"
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Trade Type","TL_LOCALIZATION_TRADE_TYPE")
          },
          {
            width: "*",
            text: getLocaleForTradeType(transformedData.tradeTypeCertificate),
            
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Accessories","TL_LOCALIZATION_ACCESSORIES")
          },
          {
            width: "*",
            text: getAssesories(transformedData.accessoriesList),
            
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("Trade License Fee","TL_LOCALIZATION_TRADE_LICENSE_FEE")
          },
          {
            width: "*",
            text: getLocaleLabels("Rs.","TL_LOCALIZATION_TRADE_LICENSE_RS") +transformedData.totalAmount,
       //     font: "Roboto"
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("License Issue Date","TL_LOCALIZATION_LICENSE_ISSUE_DATE")
          },
          {
            width: "*",
            text: transformedData.licenseIssueDate,
      
          }
        ]
      },
      {
        style: "tl-certificate-data-2",
        columns: [
          {
            width: 160,
            text: getLocaleLabels("License Validity","TL_LOCALIZATION_LICENSE_VALIDITY")
          },
          {
            width: "*",
            text: transformedData.licenseValidity.startDate +getLocaleLabels("To","TL_LOCALIZATION_TRADE_LICENSE_TO")+
              transformedData.licenseValidity.endDate
            ,
       
          }
        ]
      },
      {
        style: "tl-certificate-footer",
        columns: [
          {
            text: [
              {
                text: getLocaleLabels("Approved By:","TL_LOCALIZATION_APPROVED_BY")
              },
              {
                text: transformedData.auditorName,
        
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: getLocaleLabels("Commissioner/EO","TL_LOCALIZATION_COMMISSIONER_OR_EO"),
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
        margin: [0, 12, 0, 0], //left top right bottom
        color: "#1E1E1E"
      },
      "tl-certificate-data-2": {
        fontSize: 14,
        margin: [0, 8, 0, 0], //left top right bottom
        color: "#1E1E1E",
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
        
        fontSize: 18,
        bold: true,
        letterSpacing: 0.74
      },
      "receipt-logo-sub-text": {
        color: "#656565",
       
        fontSize: 14,
        letterSpacing: 0.74
      },
      "receipt-logo-sub-header": {
        color: "#1E1E1E",
    
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
//  console.log("Transformed Data--",transformedData);
  pdfMakeCustom.vfs = pdfFonts.vfs;
  pdfMakeCustom.fonts = {
    Camby:{
            normal: 'Cambay-Regular.ttf',
            bold: 'Cambay-Regular.ttf',
            italics: 'Cambay-Regular.ttf',
            bolditalics: 'Cambay-Regular.ttf'
    },
  
  };
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
  let data5 = _.get(
    state.screenConfiguration.preparedFinalObject.Licenses[0].tradeLicenseDetail,
    "address",
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
    ...data4,
    actualAddress:data5
  };
  switch (type) {
    case "certificate_download":
   
      let certificate_data = getCertificateData(transformedData, ulbLogo);
      certificate_data &&
     //  pdfMakeCustom.createPdf(certificate_data).download("tl_certificate.pdf");
      pdfMakeCustom.createPdf(certificate_data).open();
      break;
    case "certificate_print":
      certificate_data = getCertificateData(transformedData, ulbLogo);
      certificate_data && pdfMakeCustom.createPdf(certificate_data).print();
      break;
    case "receipt_download":
      let receipt_data = getReceiptData(transformedData, ulbLogo);
      
      receipt_data &&
     //   pdfMakeCustom.createPdf(receipt_data).download("tl_receipt.pdf");
        pdfMakeCustom.createPdf(receipt_data).open();
      break;
    case "receipt_print":
      receipt_data = getReceiptData(transformedData, ulbLogo);
      receipt_data && pdfMakeCustom.createPdf(receipt_data).print();
      break;
    default:
      break;
  }
};

export default generateReceipt;