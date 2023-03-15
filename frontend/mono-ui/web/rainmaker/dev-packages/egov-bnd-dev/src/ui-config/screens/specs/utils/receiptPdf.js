import { downloadMultipleBill } from "egov-common/ui-utils/commons";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import store from "../../../../ui-redux/store";
import {
  loadMdmsData, loadPtBillData,
  loadUlbLogo
} from "./receiptTransformer";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const billTableWidthForConsumeDetails = ["*", "*", "*", "*"];
// const billTableWidthForBillDetails = ["*", "*", "*", "*", "*", "*"];
const stylesForBills = {
  "noc-head": {
    margin: [-25, -30, 0, 1]
  },
  "receipt-logo-header": {
    color: "#000000",
    fontFamily: "Roboto",
    fontSize: 14,
    bold: true,
    letterSpacing: 0.74,
    margin: [0, -10, 0, 5]
  },
  "receipt-logo-sub-header": {
    color: "#484848",
    fontFamily: "Roboto",
    fontSize: 13,
    letterSpacing: 0.6
  },
  "noc-table": {
    fontSize: 12,
    color: "#484848",
    margin: [-25, 15, -8, -8]
  },
  "noc-table2": {
    fontSize: 12,
    color: "#484848",
    margin: [-25, 18, -8, -8]
  },
  "noc-table3": {
    fontSize: 12,
    color: "#484848",
    margin: [-25, 18, -8, -8]
  },
  "noc-table4": {
    fontSize: 12,
    color: "#484848",
    margin: [-25, 5, -8, -8]
  },
  "noc-table5": {
    fontSize: 12,
    color: "#484848",
    margin: [-25, 12, -8, -8]
  },
  "receipt-table-value": {
    color: "#000000",
    bold: true,
    fontSize: 12,
    fontWeight: 500,
    margin: [8, 5, 0, 0]
  },
  "receipt-table-value2": {
    color: "#000000",
    fontSize: 11,
    fontWeight: 400,
    margin: [3, 5, 0, 0]
  },
  "receipt-table": {
    color: "#484848",
    fontSize: 12,
    fontWeight: 400,
    margin: [-30, 5, 0, 0]
  },
  "receipt-address": {
    color: "#484848",
    fontSize: 12,
    margin: [0, -2, 0, 5],
    minWidth: 10
  },
  "receipt-table2": {
    color: "#484848",
    fontSize: 12,
    fontWeight: 400,
    margin: [3, 8, 0, 10]
  },
  "right-receipt-table": {
    color: "#000000",
    bold: true,
    fontSize: 12,
    fontWeight: 500,
    margin: [8, -10, 0, 10]
  },
  "right-receipt-table2": {
    color: "#000000",
    bold: true,
    fontSize: 12,
    fontWeight: 500,
    margin: [-30, -10, 0, 0]
  },
  "receipt-approver": {
    fontSize: 12,
    bold: true,
    margin: [-27, 50, -10, 0],
    color: "#484848"
  },
  "no-signature": {
    fontSize: 12,
    margin: [-27, 35, -10, 0],
    color: "#484848"
  },
  "amount-due": {
    fontSize: 30,
    color: "#FC8019",
    fontWeight: 700
  },
  "pt-disclaimer": {
    fontSize: 12,
    margin: [-27, 30, -10, 0],
    color: "#484848"
  },
  "pt-disclaimer-value": {
    fontSize: 12,
    margin: [0, 5, 0, 0],
    color: "#484848"
  },
  "qr-text": {
    fontSize: 12,
    margin: [40, 0, 0, 0],
    color: "#484848",
    alignment: "left"
  },
  "qr-image": {
    margin: [-40, -1, -3, 0],
    color: "#484848",
    alignment: "right"
  },
  "footer-header": {
    margin: [0, 5, 0, -10],
    color: "#000000",
    bold: true,
    alignment: "center"
  },
  footer: {
    margin: [0, 25, 0, 0],
    color: "#000000",
    bold: true,
    alignment: "right"
  }
};

// For mutliple bills
const getMutlipleBillsData = transformedDataArray => {
  let multipleBillData = transformedDataArray.map((transformedData, index) => {
    return getPdfContent(transformedData, transformedDataArray.length, index);

  });
  let finalMultipleBillData = {
    content: multipleBillData,
    styles: stylesForBills
  };
  return finalMultipleBillData;
};
//generateMutlipleBills PDF
export const generateMultipleBill = async (state, dispatch, type) => {
  dispatch(toggleSpinner());
  let allBills = get(
    state.screenConfiguration,
    "preparedFinalObject.searchScreenMdmsData.billSearchResponse",
    []
  );
  const commonPayDetails = get(
    state.screenConfiguration,
    "preparedFinalObject.searchScreenMdmsData.common-masters.uiCommonPay",
    []
  );
  const businessService = get(
    state.screenConfiguration,
    "preparedFinalObject.searchCriteria.businesService",
    ''
  );

  let billkey = ''
  const index = commonPayDetails && commonPayDetails.findIndex((item) => {
    return item.code == businessService;
  });
  if (index > -1) {
    billkey = get(commonPayDetails[index], 'billKey', '');
  } else {
    const details = commonPayDetails && commonPayDetails.filter(item => item.code === "DEFAULT");
    billkey = get(details, 'billKey', '');
  }
  allBills = allBills.filter(bill => bill.status === 'ACTIVE');
  allBills && allBills.length > 0 && await downloadMultipleBill(allBills, billkey);
  /* 
  To Download Files based on Filestoreid logic
  
  let filestoreids=[];
  let bills=[];
  allBills.map(bill=>{
    if(bill.status==='ACTIVE'){
      if(bill.fileStoreId==null){
        bills.push(bill);
      }else{
        filestoreids.push(bill.fileStoreId)
    }
    }
  })
  bills&&bills.length>0&&await downloadMultipleBill(bills,billkey);
  filestoreids&&filestoreids.length>0&&downloadMultipleFileFromFilestoreIds(filestoreids,'download'); */
  dispatch(toggleSpinner());
};
/* await loadMdmsData(tenant);
// data1 is for ULB logo from loadUlbLogo
let data1 = get(
  state.screenConfiguration.preparedFinalObject,
  "base64UlbLogo",
  {}
);

// data2 is for corporation Name from loadMdmsData
let data2 = get(
  state.screenConfiguration.preparedFinalObject,
  "mdmsDataForReceipt",
  {}
);
let transformedData = allBills.map(item => {
  const billData = loadPtBillData(item);
  return {
    ...billData,
    ulbLogo: data1,
    ...data2
  };
});
const multipleBills = getMutlipleBillsData(transformedData);
pdfMake.createPdf(multipleBills).open();
dispatch(toggleSpinner());
}; */

/************************************************SingleBill***********************************************************************/

//For single bill

const getSingleBillData = transformedData => {
  let singleBillData = {
    content: getPdfContent(transformedData, 1, 0),
    styles: stylesForBills
  };
  return singleBillData;
};

export const generateSingleBill = async billNo => {
  const state = store.getState();
  const allBills = get(
    state.screenConfiguration,
    "preparedFinalObject.searchScreenMdmsData.billSearchResponse",
    []
  );
  let billData = {};
  const data = allBills.find(
    item => get(item, "billNumber", "") === billNo
  );
  if (isEmpty(data)) {
    alert("Bill not found !");
    return;
  }
  const tenant = get(data, "tenantId");
  loadUlbLogo(tenant);
  let transformedData = await loadPtBillData(data);
  await loadMdmsData(tenant);

  // data1 is for ULB logo from loadUlbLogo
  let data1 = get(
    state.screenConfiguration.preparedFinalObject,
    "base64UlbLogo",
    {}
  );

  // data2 is for corporation Name from loadMdmsData
  let data2 = get(
    state.screenConfiguration.preparedFinalObject,
    "mdmsDataForReceipt",
    {}
  );
  getTaxHeadtable(transformedData.taxHeads);
  billData = {
    ...transformedData,
    ulbLogo: data1,
    ...data2
  };
  const singleBillData = getSingleBillData(billData);
  pdfMake.createPdf(singleBillData).open();
};

//Tranformed data is to be given from the row data bill response and then fed to the billdata and then generate PDF using that bill data

export const getTaxHeadtable = taxHeads => {
  const taxtableData = taxHeads.reduce(
    (acc, item) => {
      acc.taxTableTitles.push({
        text: item.taxHeadCode,
        border: [true, true, true, true, true, true, true],
        style: "receipt-table-key",
        alignment: "center"
      });
      acc.taxTableAmounts.push({
        text: item.amount,
        border: [true, true, true, true, true, true, true],
        style: "receipt-table-value",
        alignment: "center"
      });
      return acc;
    },
    {
      taxTableTitles: [],
      taxTableAmounts: []
    }
  );
  taxtableData.count = taxHeads.length;
  taxtableData.billTableWidthForBillDetails = taxHeads.map(item => "*");
  return taxtableData;
};

const getTaxHeadHeaders = (taxHeads) => {
  const headers = Object.keys(taxHeads).map((item, index) => {
    return {
      text: item,
      border: [false, false, false, false],
      style: "receipt-table-value2"
    };
  })
  return headers
}

const getTaxHeadValues = (taxHeads) => {
  const values = Object.values(taxHeads).map((item, index) => {
    return {
      text: item,
      border: [false, false, false, false],
      style: "receipt-table2"
    };
  })
  return values
}


const getPdfContent = (transformedData, length, index) => {
  return [
    {
      style: "noc-head",
      table: {
        widths: [60, "*", 120],
        body: [
          [
            {
              image: transformedData.ulbLogo,
              width: 50,
              height: 61.25
            },
            {
              stack: [
                {
                  text: transformedData.corporationName,
                  style: "receipt-logo-header"
                },
                {
                  stack: [
                    {
                      text: transformedData.corporationAddress,
                      style: "receipt-address"
                    },
                    {
                      text: `Tel. +91 ${transformedData.corporationContact}`,
                      style: "receipt-address"
                    },
                    {
                      text: `website: ${transformedData.corporationWebsite}`,
                      style: "receipt-address"
                    },
                    {
                      text: `Email: ${transformedData.corporationEmail}`,
                      style: "receipt-address"
                    }
                  ]
                }
              ],
              alignment: "left",
              margin: [0, 10, 0, 0]
            },
            {
              stack: [
                {
                  text: "Total Amount due"
                },
                {
                  text: `₹ ${transformedData.amountDue}`,
                  style: "amount-due"
                }
                //  {
                //         table: {
                //              widths: [
                //                "*",
                //                "*",
                //              ],
                //              body: [
                //                  [
                //                       {
                //                           image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABkAAAAZAAQMAAAAbwhzkAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURQAAAP7+/soH9D0AAAYwSURBVHja7dyxcYNAEAVQPA4UugRKoTRcGqW4BIcKNMKBcABzXu8JhIXn/UwSJ/Zt/Oea8Z+kAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAXkiyGdTn77iaHt79nLHa1oQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEJA9IC+ZVvolhHS3b88hpE+130FAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQP4AMmQK7vNpruVme80OppxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECOCeluH1PdeBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQkGND4pvaQUBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBADgYJE0OG+TTh0TggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7QqqSgpS78TUBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQF5LGRF4h2MjwoICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMhGkPI0izvTP6Ju/IosLnk/b1/yBwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB+RVyz1+mdjDlEu6gW4wKAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB6Scc1hp76MdjCGk3I0f5jsAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQHZBRJ348PhYkhNrb6rWTIICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMi2kB8yPfTRJFKepnz07fbjdX40tT4QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEJCtICuSqtWndjDllHotCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIRpDPpj797B+umSOv08PvGcj0sQUBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAdkD8pJppV/mkMXRYT5VuRtf3kFXU8kHAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQF5DGQoltbbImQxzYpMkMVN7SAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAeDnMZEype8p46CgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA8AeSem9pr0oKAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOwJSU0zh3ynW7yvOM17ceRurAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMi2kKr00dFTZgdTrjU7AAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB2RhyvICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArMkXJlylJdANIpEAAAAASUVORK5CYII=",
                //                           width: 40,
                //                           height: 40,
                //                           border: [
                //                               false,
                //                               false,
                //                               false,
                //                               false
                //                              ],
                //                           style:"qr-image",
                //                       },
                //                       {
                //                           stack:[
                //                              {
                //                               text: "Scan Code to pay",
                //                               style:"qr-text"
                //                              },
                //                              {
                //                               text: "Use any Bank/UPI App",
                //                               style:"qr-text"
                //                              },

                //                           ],
                //                           border: [
                //                               false,
                //                               false,
                //                               false,
                //                               false
                //                              ]
                //                       }
                //                    ]
                //               ],
                //                  alignment: "right",
                //                        margin: [
                //                          0,
                //                          10,
                //                          0,
                //                          0
                //                        ]
                //         }
                //    }
              ],
              alignment: "right",
              color: "#484848",
              margin: [-150, 2, -20, 0]
            }
          ]
        ]
      },
      layout: "noBorders"
    },
    {
      style: "noc-table",
      table: {
        widths: [130, 130, -2, 130, 130],
        body: [
          [
            {
              text: "Payer Name",
              border: [true, true, false, false],

              style: "receipt-table-value"
            },
            {
              text: transformedData.payerName,
              border: [false, true, true, false],

              style: "receipt-table"
            },
            {
              text: "",
              border: [false, false, false, false]
            },
            {
              text: "Bill No.",
              border: [true, true, false, false],
              style: "receipt-table-value"
            },
            {
              text: transformedData.billNumber,
              border: [false, true, true, false],
              style: "receipt-table"
            }
          ],
          [
            {
              text: "Mobile No.",
              border: [true, false, false, false],
              style: "receipt-table-value"
            },
            {
              text: transformedData.mobileNumber,
              border: [false, false, true, false],
              style: "receipt-table"
            },
            {
              text: "",
              border: [false, false, false, false]
            },
            {
              text: "Bill Period",
              border: [true, false, false, false],

              style: "receipt-table-value"
            },
            {
              text: transformedData.billPeriod,
              border: [false, false, true, false],
              style: "receipt-table"
            }
          ],
          [
            {
              text: "Payer Address",
              border: [true, false, false, false],
              style: "receipt-table-value"
            },
            {
              text: transformedData.payerAddress,
              border: [false, false, true, false],
              style: "receipt-table"
            },
            {
              text: "",
              border: [false, false, false, false]
            },
            {
              text: "Bill Issue Date",
              border: [true, false, false, false],
              style: "receipt-table-value"
            },
            {
              text: transformedData.billDate,
              border: [false, false, true, false],
              style: "receipt-table"
            }
          ],
          [
            {
              text: "Property ID",
              border: [true, false, false, true],
              style: "receipt-table-value"
            },
            {
              text: transformedData.propertyId,
              border: [false, false, true, true],
              style: "receipt-table"
            },
            {
              text: "",
              border: [false, false, false, false],
            },
            {
              text: "Bill Due Date",
              border: [true, false, false, true],
              style: "receipt-table-value"
            },
            {
              text: transformedData.dueDate,
              border: [false, false, true, true],
              style: "receipt-table"
            }
          ]
        ]
      },
      layout: {}
    },

    {
      style: "noc-table2",
      table: {
        widths: ["103%"],
        body: [
          [
            {
              text: "Billing Summary - Property Tax",
              border: [true, true, true, false],
              style: "receipt-table-value"
            }
          ],
          [
            {
              table: {
                widths: ["10%", "14%", "13%", "14%", "10%", "9%", "9%", "10%", "12%"],
                body: [
                  getTaxHeadHeaders(transformedData.taxHeads),
                  getTaxHeadValues(transformedData.taxHeads)
                ]
              },
              border: [true, false, true, true]
            }
          ]
        ]
      },
      layout: {}
    },
    {
      style: "noc-table3",
      table: {
        widths: ["103%"],
        body: [
          [
            {
              text: "Important Message",
              border: [true, true, true, false],
              margin: [9, 10, 0, 5],
              style: "receipt-table-value"
            }
          ],
          [
            {
              ol: [
                {
                  text:
                    "5% rebate will be given if tax is paid for both half years at a time before 30th April of current financial year.",
                  margin: [8, 0, 0, 5]
                },
                {
                  text:
                    "Property tax can be paid through: Cash or Cheque at eSeva, Mee Seva centres or Municipal Office or Online through Credit Card/Debitcard/Net Banking.",
                  margin: [8, 0, 0, 5]
                },
                {
                  text:
                    "Due dates for payment of property tax without interest for current financial year: First half year 30th June, Second half year: 31st December.",
                  margin: [8, 0, 0, 5]
                },
                {
                  text:
                    "A simple interest @ 2% per month will be charged in case of failure to pay property tax by due dates as above.",
                  margin: [8, 0, 0, 5]
                },
                {
                  text:
                    "If the tax payers fail to pay the property tax within 15 days from the date of receipt of this Demand Bill, the same amount can be collected by issuing a distraint warrant u/s Section-269 of Municipal Corporations Act, 1955 (formerly GHMC Act, 1955).",
                  margin: [8, 0, 0, 5]
                },
                {
                  text:
                    "Please bring this bill while paying at Office counter or eSeva or Mee Seva centers. ",
                  margin: [8, 0, 0, 10]
                }
              ],
              border: [true, false, true, true],
              alignment: "left"
            }
          ]
        ]
      },
      layout: {}
    },
    {
      canvas: [
        {
          type: "line",
          x1: -40,
          y1: 20,
          x2: 700,
          y2: 20,
          dash: { length: 10, space: 5 }
        }
      ]
    },
    {
      image:
        "data:image/png;base64,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",
      width: 14,
      height: 14,
      margin: [-30, -7, 0, 0]
    },
    {
      text: "Acknowledgement( For Official use only)",
      style: "footer-header"
    },
    {
      style: "noc-table5",
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          [
            {
              text: "Date",
              border: [false, false, false, false],

              style: "receipt-table-value"
            },
            {
              text: transformedData.billDate,
              border: [false, false, false, false],

              style: "receipt-table"
            },
            {
              text: "Consumer ID",
              border: [false, false, false, false],

              style: "receipt-table-value"
            },
            {
              text: transformedData.propertyId,
              border: [false, false, false, false],

              style: "receipt-table"
            }
            // {
            //   text: "",
            //   border: [false, false, false, false],

            //   style: "receipt-table-value"
            // },
            // {
            //   text: "",
            //   border: [false, false, false, false],

            //   style: "receipt-table"
            // }
          ],
          [

            {
              text: "Bill No.",
              border: [false, false, false, false],

              style: "receipt-table-value"
            },
            {
              text: transformedData.billNumber,
              border: [false, false, false, false],

              style: "receipt-table"
            },
            {
              text: "Total Payment",
              border: [false, false, false, false],

              style: "receipt-table-value"
            },
            {
              text: transformedData.totalAmount,
              border: [false, false, false, false],

              style: "receipt-table"
            }
          ],
        ]
      }
    },
    {
      style: "noc-table4",
      table: {
        widths: ["25%", "75%"],
        body: [
          [
            {
              text: "Name & Address",
              border: [false, false, false, false],

              style: "receipt-table-value"
            },
            {
              text: transformedData.payerAddress,
              border: [false, false, false, false],

              style: "receipt-table"
            }
          ]
        ]
      }
    },
    {
      text: "Receiver’s Signature & Mobile No. ",
      style: "footer",
      pageBreak: index === length - 1 ? "" : "after",

    }
  ]
}