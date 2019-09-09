import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import store from "../../../../ui-redux/store";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  loadReceiptData,
  loadUlbLogo,
  loadMdmsData
} from "./receiptTransformer";
import { loadReceiptGenerationData } from "./receiptTransformer";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const receiptTableWidth = ["*", "*", "*", "*"];
const getCitizenReceipetData = transformedData => {
  let citizenRecieptData = {
    content: [
      {
        style: "tl-head",
        table: {
          widths: [100, "*", 18],
          body: [
            [
              {
                image: transformedData.ulbLogo,
                width: 60,
                height: 61.25,
                margin: [41, 12, 10, 10],
                border: [false, false, false, false]
              },
              {
                stack: [
                  {
                    text: transformedData.corporationName,
                    style: "receipt-logo-header"
                  },
                  {
                    text: "Payment Receipt",
                    style: "receipt-logo-sub-header",
                    margin: [0, 10, 0, 0]
                  }
                ],
                alignment: "left",
                border: [false, false, false, false],

                margin: [10, 23, 0, 0]
              },
              {
                stack: [
                  {
                    text: "Receipt No",
                    style: "receipt-logo-sub-header"
                  },
                  {
                    text: transformedData.receiptNumber,
                    style: "receipt-logo-header-value",
                    margin: [0, 10, 0, 0]
                  }
                ],
                alignment: "center",
                margin: [-250, 23, 0, 0]
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
                text: "Receipt Date   ",
                bold: true
              },
              {
                text: transformedData.receiptDate,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Contact No ",
                bold: true
              },
              {
                text:`${transformedData.corporationContact}`,
                bold: false
              }
            ],
            alignment: "right",
            margin: [100, 0, 0, 0]
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Tax Period   ",
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
                text: "Website ",
                bold: true
              },
              {
                text:`${transformedData.corporationWebsite}`,
                bold: false
              }
            ],
            alignment: "right",
            margin: [0, 0, 0, 0]
          }
        ]
      },

      {
        text: "",
        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,

          body: [
            [
              {
                text: "Consumer Name",
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
                text: "Service Category",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.serviceCategory,
                border: [false, true, true, true]
              },
              {
                text: "Service Type",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.serviceType,
                border: [false, true, true, true]
              }
            ],
            [
              {
                text: "Amount Paid",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.amountPaid,
                border: [false, true, true, true]
              },
              {
                text: "Payment Mode",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.paymentMode,
                border: [false, true, true, true]
              }
              // {
              //   text: "Amount Due",
              //   border: [true, true, false, true],
              //   style: "receipt-table-key"
              // },
              // {
              //   text: transformedData.amountDue,
              //   border: [false, true, true, true]
              // }
            ],
            [
              {
                text: "G8 Receipt No.",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.g8ReceiptNo,
                border: [false, true, true, true]
              },
              {
                text: "G8 Receipt Date",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.g8ReceiptDate,
                border: [false, true, true, true]
              }
            ],
            [
              {
                text: "Created By",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.createdBy,
                border: [false, true, true, true]
              },
              {
                text: "Comments",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.comments,
                border: [false, true, true, true]
              }
            ]
          ]
        },
        layout: {}
      },
      {
        text: "",
        style: "pt-reciept-citizen-subheader"
      },

      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Authorised signatory",
                bold: true
              }
            ],
            alignment: "right"
          }
        ]
      }
    ],

    footer: [],

    styles: {
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
        margin: [-18, 16, 8, 15],
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
      "receipt-logo-header-value": {
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
        fontSize: 13,
        margin: []
      },
      "receipt-approver": {
        fontSize: 10,
        bold: true,
        margin: [-10, -60, 10, -8],
        color: "#484848"
      }
    }
  };
  return citizenRecieptData;
};

const getReceiptData = transformedData => {
  let receiptData = {
    content: [
      {
        style: "tl-head",
        table: {
          widths: [100, "*", 18],
          body: [
            [
              {
                image: transformedData.ulbLogo,
                width: 60,
                height: 61.25,
                margin: [41, 12, 10, 10],
                border: [false, false, false, false]
              },
              {
                stack: [
                  {
                    text: transformedData.corporationName,
                    style: "receipt-logo-header"
                  },
                  {
                    text: "Payment Receipt (Citizen Copy)",
                    style: "receipt-logo-sub-header",
                    margin: [0, 10, 0, 0]
                  }
                ],
                alignment: "left",
                border: [false, false, false, false],
                margin: [10, 23, 0, 0]
              },
              {
                stack: [
                  {
                    text: "Receipt No",
                    style: "receipt-logo-sub-header"
                  },
                  {
                    text: transformedData.receiptNumber,
                    style: "receipt-logo-header-value",
                    margin: [0, 10, 0, 0]
                  }
                ],
                alignment: "center",
                margin: [-250, 23, 0, 0]
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
                text: "Receipt Date   ",
                bold: true
              },
              {
                text: transformedData.receiptDate,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Contact No ",
                bold: true
              },
              {
                text:`${transformedData.corporationContact}`,
                bold: false
              }
            ],
            alignment: "right",
            margin: [100, 0, 0, 0]
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Tax Period   ",
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
                text: "Website ",
                bold: true
              },
              {
                text:`${transformedData.corporationWebsite}`,
                bold: false
              }
            ],
            alignment: "right",
            margin: [0, 0, 0, 0]
          }
        ]
      },

      {
        text: "",
        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,

          body: [
            [
              {
                text: "Consumer Name",
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
                text: "Service Category",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.serviceCategory,
                border: [false, true, true, true]
              },
              {
                text: "Service Type",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.serviceType,
                border: [false, true, true, true]
              }
            ],
            [
              {
                text: "Amount Paid",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.amountPaid,
                border: [false, true, true, true]
              },
              {
                text: "Payment Mode",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.paymentMode,
                border: [false, true, true, true]
              }
              // {
              //   text: "Amount Due",
              //   border: [true, true, false, true],
              //   style: "receipt-table-key"
              // },
              // {
              //   text: transformedData.amountDue,
              //   border: [false, true, true, true]
              // }
            ],
            [
              {
                text: "G8 Receipt No.",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.g8ReceiptNo,
                border: [false, true, true, true]
              },
              {
                text: "G8 Receipt Date",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.g8ReceiptDate,
                border: [false, true, true, true]
              }
            ],
            [
              {
                text: "Created By",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.createdBy,
                border: [false, true, true, true]
              },
              {
                text: "Comments",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.comments,
                border: [false, true, true, true]
              }
            ]
          ]
        },
        layout: {}
      },
      {
        text: "",
        style: "pt-reciept-citizen-subheader"
      },

      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Authorised signatory",
                bold: true
              }
            ],
            alignment: "right"
          }
        ]
      },
      {
        text:
          " _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ ",
        style: "pt-reciept-citizen-subheader"
      },
      {
        text: "",
        style: "pt-reciept-citizen-subheader"
      },
      {
        text: "",
        style: "pt-reciept-citizen-subheader"
      },
      //Second part starts from here
      {
        style: "tl-head",
        table: {
          widths: [100, "*", 18],
          body: [
            [
              {
                image: transformedData.ulbLogo,
                width: 60,
                height: 61.25,
                margin: [41, 12, 10, 10],
                border: [false, false, false, false]
              },
              {
                stack: [
                  {
                    text: transformedData.corporationName,
                    style: "receipt-logo-header"
                  },
                  {
                    text: "Payment Receipt (Employee Copy)",
                    style: "receipt-logo-sub-header",
                    margin: [0, 10, 0, 0]
                  }
                ],
                alignment: "left",
                border: [false, false, false, false],
                margin: [10, 23, 0, 0]
              },
              {
                stack: [
                  {
                    text: "Receipt No",
                    style: "receipt-logo-sub-header"
                  },
                  {
                    text: transformedData.receiptNumber,
                    style: "receipt-logo-header-value",
                    margin: [0, 10, 0, 0]
                  }
                ],
                alignment: "center",
                margin: [-250, 23, 0, 0]
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
                text: "Receipt Date   ",
                bold: true
              },
              {
                text: transformedData.receiptDate,
                bold: false
              }
            ],
            alignment: "left"
          },
          {
            text: [
              {
                text: "Contact No ",
                bold: true
              },
              {
                text:`${transformedData.corporationContact}`,
                bold: false
              }
            ],
            alignment: "right",
            margin: [100, 0, 0, 0]
          }
        ]
      },
      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Tax Period   ",
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
                text: "Website ",
                bold: true
              },
              {
                text:`${transformedData.corporationWebsite}`,
                bold: false
              }
            ],
            alignment: "right",
            margin: [0, 0, 0, 0]
          }
        ]
      },

      {
        text: "",
        style: "pt-reciept-citizen-subheader"
      },
      {
        style: "pt-reciept-citizen-table",
        table: {
          widths: receiptTableWidth,

          body: [
            [
              {
                text: "Consumer Name",
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
                text: "Service Category",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.serviceCategory,
                border: [false, true, true, true]
              },
              {
                text: "Service Type",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.serviceType,
                border: [false, true, true, true]
              }
            ],
            [
              {
                text: "Amount Paid",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.amountPaid,
                border: [false, true, true, true]
              },
              {
                text: "Payment Mode",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.paymentMode,
                border: [false, true, true, true]
              }
              // {
              //   text: "Amount Due",
              //   border: [true, true, false, true],
              //   style: "receipt-table-key"
              // },
              // {
              //   text: transformedData.amountDue,
              //   border: [false, true, true, true]
              // }
            ],
            [
              {
                text: "G8 Receipt No.",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.g8ReceiptNo,
                border: [false, true, true, true]
              },
              {
                text: "G8 Receipt Date",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.g8ReceiptDate,
                border: [false, true, true, true]
              }
            ],
            [
              {
                text: "Created By",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.createdBy,
                border: [false, true, true, true]
              },
              {
                text: "Comments",
                border: [true, true, false, true],
                style: "receipt-table-key"
              },
              {
                text: transformedData.comments,
                border: [false, true, true, true]
              }
            ]
          ]
        },
        layout: {}
      },
      {
        text: "",
        style: "pt-reciept-citizen-subheader"
      },

      {
        style: "pt-reciept-citizen-header",
        columns: [
          {
            text: [
              {
                text: "Authorised signatory",
                bold: true
              }
            ],
            alignment: "right"
          }
        ]
      }
    ],

    footer: [],

    styles: {
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
        fontSize: 13
      },
      "receipt-approver": {
        fontSize: 10,
        bold: true,
        margin: [-10, -60, 10, -8],
        color: "#484848"
      }
    }
  };
  return receiptData;
};

//Generates PDF for Employee Reciept
export const generateReciept = async rowData => {
  const state = store.getState();
  const allReceipts = get(
    state.screenConfiguration,
    "preparedFinalObject.receiptSearchResponse",
    {}
  );

  let receipt_data = {};

  let transformedData = {};
  if (getQueryArg(window.location.href, "receiptNumber")) {
    if (allReceipts.Receipt && isEmpty(allReceipts.Receipt[0])) {
      return;
    }
    const tenant = get(allReceipts.Receipt[0], "tenantId");
    loadUlbLogo(tenant);
    transformedData =
      (allReceipts.Receipt &&
        (await loadReceiptData(allReceipts.Receipt[0]))) ||
      {};
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

    let finalTransformedData = {
      ...transformedData, //getreceiptData
      ulbLogo: data1, //UlbLogo
      ...data2 //MDMS
    };
    receipt_data =
      !isEmpty(finalTransformedData) && getReceiptData(finalTransformedData);
  } else {
    const data = allReceipts.Receipt.find(
      item =>
        get(item, "Bill[0].billDetails[0].receiptNumber", "") === rowData[0]
    );
    if (isEmpty(data)) {
      return;
    }
    const tenant = get(allReceipts.Receipt[0], "tenantId");
    loadUlbLogo(tenant);
    transformedData = await loadReceiptData(data);
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

    let finalTransformedData = {
      ...transformedData, //getreceiptData
      ulbLogo: data1, //UlbLogo
      ...data2 //MDMS
    };
    receipt_data =
      !isEmpty(finalTransformedData) && getReceiptData(finalTransformedData);
  }
  receipt_data &&
    !isEmpty(transformedData) &&
    pdfMake.createPdf(receipt_data).open();
};

//Generates PDF for Citizen Reciept
export const generateCitizenReciept = async rowData => {
  const state = store.getState();
  const allReceipts = get(
    state.screenConfiguration,
    "preparedFinalObject.receiptSearchResponse",
    {}
  );
  let citizenReceipt_data = {};
  const data = allReceipts.Receipt.find(
    item => get(item, "Bill[0].billDetails[0].receiptNumber", "") === rowData[0]
  );
  if (isEmpty(data)) {
    return;
  }
  const tenant = get(allReceipts.Receipt[0], "tenantId");
  loadUlbLogo(tenant);
  const transformedData = await loadReceiptData(data);
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

  let finalTransformedData = {
    ...transformedData, //getreceiptData
    ulbLogo: data1, //UlbLogo
    ...data2 //MDMS
  };
  citizenReceipt_data =
    !isEmpty(finalTransformedData) &&
    getCitizenReceipetData(finalTransformedData);
  citizenReceipt_data &&
    !isEmpty(transformedData) &&
    pdfMake.createPdf(citizenReceipt_data).open();
};
