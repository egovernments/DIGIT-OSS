import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import store from "../../../../ui-redux/store";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {
  loadPtBillData,
  loadUlbLogo,
  loadMdmsData
} from "./receiptTransformer";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const billTableWidthForConsumeDetails = ["*", "*", "*", "*"];
// const billTableWidthForBillDetails = ["*", "*", "*", "*", "*", "*"];
const stylesForBills = {
  "tl-head": {
    fillColor: "#F2F2F2",
    margin: [-70, -41, -81, 0]
  },
  "pt-reciept-citizen-header": {
    fontSize: 12,
    bold: true,
    margin: [-18, 8, 10, 0],
    color: "#484848"
  },
  "pt-reciept-citizen-subheader": {
    fontSize: 10,
    bold: true,
    margin: [-18, 16, 8, 8],
    color: "#484848"
  },
  "pt-reciept-citizen-table": {
    fontSize: 10,
    color: "#484848",
    margin: [-20, -2, -8, -8]
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
    letterSpacing: 0.6
  },
  "pt-reciept-citizen-footer": {
    color: "#484848",
    fontSize: 12,
    margin: [15, -5, 10, 5]
  },
  "receipt-footer": {
    color: "#484848",
    fontSize: 8,
    margin: [-6, 15, -15, -10]
  },
  "receipt-no": {
    color: "#484848",
    fontSize: 10
  },
  "receipt-approver": {
    fontSize: 10,
    bold: true,
    margin: [-10, -60, 10, -8],
    color: "#484848"
  }
};

// For mutliple bills
const getMutlipleBillsData = transformedData => {
  let multipleBillData = transformedData.map(item => {
    return [
      {
        style: "tl-head",
        table: {
          widths: [100, "*", 18],
          body: [
            [
              {
                image: item.ulbLogo,
                width: 60,
                height: 61.25,
                margin: [41, 12, 10, 10],
                border: [false, false, false, false]
              },
              {
                stack: [
                  {
                    text: "AMRITSAR MUNCIPAL CORPORATION",
                    style: "receipt-logo-header"
                  },
                  {
                    text: "Property Tax Bill",
                    style: "receipt-logo-sub-header"
                  }
                ],
                alignment: "left",
                border: [false, false, false, false],
                margin: [10, 23, 0, 0]
              }
            ]
          ]
        },
        layout: {}
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Bill Date  ",
                bold: true
              },
              {
                text: item.billDate,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Bill No.  ",
                bold: true
              },
              {
                text: item.billNumber,
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
                text: "Tax Period  ",
                bold: true
              },
              {
                text: item.taxPeriod,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Due Date   ",
                bold: true
              },
              {
                text: item.dueDate,
                bold: false
              }
            ],
            alignment: "right"
          }
        ]
      },
      {
        text: "CONSUMER DETAILS",
        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          //give the auto-fit widths
          widths: billTableWidthForConsumeDetails,
          body: [
            [
              {
                text: "Consumer ID",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: item.propertyId,
                border: [false, true, true, true]
              },
              {
                text: "Assessment No.",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: item.AssessNo,
                border: [false, true, true, true]
              }
            ],
            [
              {
                text: "Name",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: item.consumerName,
                border: [false, true, true, true]
              },
              {
                text: "Mobile No.",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: item.mobileNumber,
                border: [false, true, true, true]
              }
            ],

            [
              {
                text: "Address",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: item.payerAddress,
                border: [false, true, true, true]
              },
              {
                text: "Locality",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: item.locality,
                border: [false, true, true, true]
              }
            ]
          ]
        },
        layout: {}
      },
      {
        text: "BILL DETAILS",
        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          //Give Auto-fit widths
          widths: getTaxHeadtable(item.taxHeads).billTableWidthForBillDetails,
          //taxHeads thing
          body: [
            [...getTaxHeadtable(item.taxHeads).taxTableTitles],
            [...getTaxHeadtable(item.taxHeads).taxTableAmounts]
          ]
        },
        layout: {}
      },
      [
        {
          style: "receipt-footer",
          columns: [
            {
              text: [
                {
                  text:
                    "Note:\n1. The citizen can make either full or partial payment for the bill. \n2. Bill can be paid online through - mSeva app, (site link) or at the ULB using cash, cheque and DD.\n3. Pay your bill before 30th September to avail rebate. \n4. Please bring the bill while paying at the counter. \n5. Bill is as per your property details declared and Punjab Municipal Act 1911.",
                  bold: false
                }
              ],
              alignment: "left",
              "X Position": 19
            }
          ]
        }
      ],
      {
        style: "pt-reciept-citizen-header",
        columns: [
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
      },
      {
        text:
          "_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ",

        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: " Acknowledgement (For Official use only) ",
                bold: true
              }
            ],
            alignment: "center"
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: " Date ",
                bold: true
              },
              {
                text: "24-04-2018",
                bold: false
              }
            ],
            alignment: "left"
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Consumer ID ",
                bold: true
              },
              {
                text: item.propertyId,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Bill No. ",
                bold: true
              },
              {
                text: item.billNumber,
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
                text: "Name & Address. ",
                bold: true
              },
              {
                text: item.consumerName + ", " + "\n" + item.payerAddress,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Total Payment ",
                bold: true
              },
              {
                text: item.totalAmount,
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
                text: "Receiver's Signature & Mobile No. ",
                bold: true
              }
            ],
            pageBreak: "after",
            alignment: "right"
          }
        ]
      }
    ];
  });
  let finalMultipleBillData = {
    content: multipleBillData,
    styles: stylesForBills
  };
  return finalMultipleBillData;
};

//generateMutlipleBills PDF
export const generateMultipleBill = async (state, dispatch, type) => {
  const allBills = get(
    state.screenConfiguration,
    "preparedFinalObject.searchScreenMdmsData.billSearchResponse",
    []
  );
  const tenant = getTenantId();
  loadUlbLogo(tenant);
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
};

/************************************************SingleBill***********************************************************************/

//For single bill

const getSingleBillData = transformedData => {
  let singleBillData = {
    content: [
      {
        style: "tl-head",
        table: {
          widths: [100, "*", 18],
          body: [
            [
              {
                image: transformedData.ulbLogo,
                // "data:image/png;base64,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",
                width: 60,
                height: 61.25,
                margin: [41, 12, 10, 10],
                border: [false, false, false, false]
              },
              {
                stack: [
                  {
                    text: "AMRITSAR MUNCIPAL CORPORATION",
                    style: "receipt-logo-header"
                  },
                  {
                    text: "Property Tax Bill",
                    style: "receipt-logo-sub-header"
                  }
                ],
                alignment: "left",
                border: [false, false, false, false],
                margin: [10, 23, 0, 0]
              }
            ]
          ]
        },
        layout: {}
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Bill Date  ",
                bold: true
              },
              {
                text: transformedData.billDate,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Bill No.  ",
                bold: true
              },
              {
                text: transformedData.billNumber,
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
                text: "Tax Period  ",
                bold: true
              },
              {
                text: transformedData.taxPeriod,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Due Date   ",
                bold: true
              },
              {
                text: transformedData.dueDate,
                bold: false
              }
            ],
            alignment: "right"
          }
        ]
      },
      {
        text: "CONSUMER DETAILS",
        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          //give the auto-fit widths
          widths: billTableWidthForConsumeDetails,
          body: [
            [
              {
                text: "Consumer ID",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.propertyId,
                border: [false, true, true, true]
              },
              {
                text: "Assessment No.",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.AssessNo,
                border: [false, true, true, true]
              }
            ],
            [
              {
                text: "Name",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.consumerName,
                border: [false, true, true, true]
              },
              {
                text: "Mobile No.",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.mobileNumber,
                border: [false, true, true, true]
              }
            ],

            [
              {
                text: "Address",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.payerAddress,
                border: [false, true, true, true]
              },
              {
                text: "Locality",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.locality,
                border: [false, true, true, true]
              }
            ]
          ]
        },
        layout: {}
      },
      {
        text: "BILL DETAILS",
        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          //Give Auto-fit widths
          widths: getTaxHeadtable(transformedData.taxHeads)
            .billTableWidthForBillDetails,
          //taxHeads thing
          body: [
            [...getTaxHeadtable(transformedData.taxHeads).taxTableTitles],
            [...getTaxHeadtable(transformedData.taxHeads).taxTableAmounts]
          ]
        },
        layout: {}
      },
      [
        {
          style: "receipt-footer",
          columns: [
            {
              text: [
                {
                  text:
                    "Note:\n1. The citizen can make either full or partial payment for the bill. \n2. Bill can be paid online through - mSeva app, (site link) or at the ULB using cash, cheque and DD.\n3. Pay your bill before 30th September to avail rebate. \n4. Please bring the bill while paying at the counter. \n5. Bill is as per your property details declared and Punjab Municipal Act 1911.",
                  bold: false
                }
              ],
              alignment: "left",
              "X Position": 19
            }
          ]
        }
      ],
      {
        style: "pt-reciept-citizen-header",
        columns: [
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
      },
      {
        text:
          "_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ",

        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: " Acknowledgement (For Official use only) ",
                bold: true
              }
            ],
            alignment: "center"
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: " Date ",
                bold: true
              },
              {
                text: "24-04-2018",
                bold: false
              }
            ],
            alignment: "left"
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Consumer ID ",
                bold: true
              },
              {
                text: transformedData.propertyId,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Bill No.  ",
                bold: true
              },
              {
                text: transformedData.billNumber,
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
                text: "Name & Address. ",
                bold: true
              },
              {
                text:
                  transformedData.consumerName +
                  ", " +
                  "\n" +
                  transformedData.payerAddress,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Total Payment ",
                bold: true
              },
              {
                text: transformedData.totalAmount,
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
                text: "Receiver's Signature & Mobile No. ",
                bold: true
              }
            ],
            // pageBreak: "after",
            alignment: "right"
          }
        ]
      }
    ],

    styles: stylesForBills
  };
  return singleBillData;
};

export const generateSingleBill = async rowData => {
  const state = store.getState();
  const allBills = get(
    state.screenConfiguration,
    "preparedFinalObject.searchScreenMdmsData.billSearchResponse",
    []
  );
  let billData = {};
  const data = allBills.find(
    item =>
      get(item, "billDetails[0].consumerCode", "") === rowData[1]
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
