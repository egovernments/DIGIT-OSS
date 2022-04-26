import React from "react";

export const getKeyNotesConfig = (businessService, t) => {
  const businessId = businessService?.toLowerCase().split(".")[0];

  switch (businessId) {
    case "pt":
      return {
        "my-bill": [
          {
            keyValue: "CS_COMMON_AMOUNT_DUE",
            keyPath: [
              (d) => {
                const overdueBy = new Date().getTime() - new Date(d.billDetails[0]?.toPeriod).getTime();
                const days = Math.floor(overdueBy / (86400 * 1000));
                return (
                  <React.Fragment>
                    {"₹" + d["totalAmount"]}
                    {days >= 0 ? (
                      <span className={"card-label-error"} style={{ fontSize: "16px", fontWeight: "normal" }}>{` ( ${t(
                        "CS_PAYMENT_OVERDUE"
                      )} ${days} ${t(days === 1 ? "CS_COMMON_DAY" : "CS_COMMON_DAYS")})`}</span>
                    ) : null}
                  </React.Fragment>
                );
              },
            ],
            fallback: "N/A",
            noteStyle: { fontWeight: "bold", fontSize: "24px", paddingTop: "5px" },
          },
          {
            keyValue: "PT_PROPERTY_ID",
            keyPath: ["propertyId"],
            fallback: "",
          },
          {
            keyValue: "CS_OWNER_NAME",
            keyPath: ["owners", 0, "name"],
            fallback: "ES_TITLE_FSM",
          },
          {
            keyValue: "PT_PROPERTY_ADDRESS",
            keyPath: ["address", "locality", "name"],
            fallback: "CS_APPLICATION_TYPE_DESLUDGING",
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
            keyValue: "PT_DUE_DATE",
            keyPath: [
              "billDetails",
              (d) => {
                if (!d[0]?.toPeriod) return "N/A";
                const date = new Date(d[0]?.toPeriod);
                const month = Digit.Utils.date.monthNames[date.getMonth()];
                return `${date.getDate()} ${month} ${date.getFullYear()}`;
              },
            ],
            fallback: "N/A",
          },
        ],
        response: [],
      };

    /**<Row rowContainerStyle={{ padding: "4px 10px" }} last label={t("CS_PAYMENT_TRANSANCTION_ID")} text={egId} />
        <Row rowContainerStyle={{ padding: "4px 10px" }} last label={t("CS_PAYMENT_AMOUNT_PAID")} text={amount} />
        <Row
          rowContainerStyle={{ padding: "4px 10px" }}
          last

          You will be redirected to a third-party payment gateway.
          mSeva does not save any credit or debit card details

          label={t("CS_PAYMENT_TRANSANCTION_DATE")}
          text={transactionDate && new Date(transactionDate).toLocaleDateString("in")}
        /> */

    case "fsm":
      return {
        "my-bill": [
          {
            keyValue: "CS_COMMON_AMOUNT_DUE",
            keyPath: ["totalAmount", (d) => d.toFixed(2), (d) => "₹" + d],
            fallback: "N/A",
            noteStyle: { fontWeight: "bold", fontSize: "24px", paddingTop: "5px" },
          },
        ],
        response: [],
      };
  }
};
