export const BillDetailsKeyNoteConfig = () => ({
  PT: {
    heading: "ES_BILL_DETAILS_PT_DETAILS_HEADING",
    details: [
      {
        keyValue: "PT_PROPERTY_ID",
        keyPath: ["consumerCode"],
        fallback: "",
      },
      {
        keyValue: "CS_PAYMENT_BILLING_PERIOD",
        keyPath: [
          "billDetails",
          (d) => {
            const { fromPeriod, toPeriod } = d[0];
            if (fromPeriod && toPeriod) {
              let from = new Date(fromPeriod).getFullYear().toString();
              let to = new Date(toPeriod).getFullYear().toString();
              return "FY " + from + "-" + to;
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
      {
        keyValue: "CS_BILL_NO",
        keyPath: [
          "billDetails",
          (d) => {
            const { currentBillNo } = d[0];
            if (currentBillNo) {
              return currentBillNo;
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
      {
        keyValue: "CS_BILL_DUEDATE",
        keyPath: [
          "billDetails",
          (d) => {
            const { currentExpiryDate } = d[0];
            if (currentExpiryDate) {
              return new Date(currentExpiryDate).toLocaleDateString();
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
    ],
  },
  mcollect: {
    heading: "COMMON_PAY_SCREEN_HEADER",
    details: [
      {
        keyValue: "UC_CHALLAN_NO",
        keyPath: ["consumerCode"],
        fallback: "",
      },
    ],
  },
  "PT.MUTATION": {
    heading: "COMMON_PAY_SCREEN_HEADER",
    details: [
      {
        keyValue: "PDF_STATIC_LABEL_MUATATION_NUMBER_LABEL",
        keyPath: ["consumerCode"],
        fallback: "",
      },
      {
        keyValue: "CS_BILL_NO",
        keyPath: [
          "billDetails",
          (d) => {
            const { currentBillNo } = d[0];
            if (currentBillNo) {
              return currentBillNo;
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
      {
        keyValue: "CS_BILL_DUEDATE",
        keyPath: [
          "billDetails",
          (d) => {
            const { currentExpiryDate } = d[0];
            if (currentExpiryDate) {
              return new Date(currentExpiryDate).toLocaleDateString();
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
    ],
  },
  TL: {
    heading: "COMMON_PAY_SCREEN_HEADER",
    details: [
      {
        keyValue: "TL_TRADE_LICENSE_LABEL",
        keyPath: ["consumerCode"],
        fallback: "",
      },
    ],
  },
  "WS.ONE_TIME_FEE": {
    heading: "COMMON_PAY_SCREEN_HEADER",
    details: [
      {
        keyValue: "WS_COMMON_TABLE_APP_NO_LABEL",
        keyPath: ["consumerCode"],
        fallback: "",
      },
    ],
  },
  "SW.ONE_TIME_FEE": {
    heading: "COMMON_PAY_SCREEN_HEADER",
    details: [
      {
        keyValue: "WS_COMMON_TABLE_APP_NO_LABEL",
        keyPath: ["consumerCode"],
        fallback: "",
      },
    ],
  },
  WS: {
    heading: "COMMON_PAY_SCREEN_HEADER",
    details: [
      {
        keyValue: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL",
        keyPath: ["consumerCode"],
        fallback: "",
      },
      {
        keyValue: "CS_PAYMENT_BILLING_PERIOD",
        keyPath: [
          "billDetails",
          (d) => {
            const { fromPeriod, toPeriod } = d[0];
            if (fromPeriod && toPeriod) {
              let from = new Date(fromPeriod).toLocaleDateString();
              let to = new Date(toPeriod).toLocaleDateString();
              return from + " - " + to;
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
      {
        keyValue: "CS_BILL_NO",
        keyPath: ["billNumber"],

        fallback: "N/A",
      },
      {
        keyValue: "CS_BILL_DUEDATE",
        keyPath: [
          "billDetails",
          (d) => {
            const { currentExpiryDate } = d[0];
            if (currentExpiryDate) {
              return new Date(currentExpiryDate).toLocaleDateString();
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
    ],
  },
  SW: {
    heading: "COMMON_PAY_SCREEN_HEADER",
    details: [
      {
        keyValue: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL",
        keyPath: ["consumerCode"],
        fallback: "",
      },
      {
        keyValue: "CS_PAYMENT_BILLING_PERIOD",
        keyPath: [
          "billDetails",
          (d) => {
            const { fromPeriod, toPeriod } = d[0];
            if (fromPeriod && toPeriod) {
              let from = new Date(fromPeriod).toLocaleDateString();
              let to = new Date(toPeriod).toLocaleDateString();
              return from + " - " + to;
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
      {
        keyValue: "CS_BILL_NO",
        keyPath: ["billNumber"],
        fallback: "N/A",
      },
      {
        keyValue: "CS_BILL_DUEDATE",
        keyPath: [
          "billDetails",
          (d) => {
            const { expiryDate } = d[0];
            if (expiryDate) {
              return new Date(expiryDate).toLocaleDateString();
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
    ],
  },
  FSM: {
    heading: "COMMON_PAY_SCREEN_HEADER",
    details: [
      {
        keyValue: "ADV_TOTAL_AMOUNT",
        keyPath: ["totalAmount"],
        fallback: "",
      },
      {
        keyValue: "ADV_COLLECTION",
        keyPath: ["totalAmountPaid"],
        fallback: "N/A",
      },
    ],
  },
});
