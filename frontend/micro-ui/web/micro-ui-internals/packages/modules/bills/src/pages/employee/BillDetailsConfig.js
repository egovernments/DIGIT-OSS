export const BillDetailsConfig = {
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
    }
}