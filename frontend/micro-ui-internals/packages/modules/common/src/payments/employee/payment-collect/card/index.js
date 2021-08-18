import React from "react";

export const useCardPaymentDetails = (props, t) => {
  const config = [
    {
      head: t("PAYMENT_CARD_HEAD"),
      headId: "paymentInfo",
      body: [
        {
          label: t("PAYMENT_CARD_LAST_DIGITS_LABEL"),
          type: "number",
          populators: {
            name: "instrumentNumber",
            validation: {
              required: true,
              pattern: /^\d{4}$/,
            },
            error: t("PAYMENT_CARD_LAST_DIGITS_ERROR"),
            min: "0",
            max: "9999",
          },
        },
        {
          label: t("PAYMENT_TRANS_NO_LABEL"),
          type: "number",
          populators: {
            name: "transactionNumber",
            validation: {
              required: true,
              pattern: /^\d{5,}$/,
            },
            error: t("PAYMENT_TRANS_NO_ERROR"),
          },
        },
        {
          label: t("PAYMENT_RENTR_TRANS_LABEL"),
          type: "number",
          populators: {
            name: "reTransanctionNumber",
            validation: {
              required: true,
              pattern: /^\d{5,}$/,
            },
            error: t("PAYMENT_RENTR_TRANS_ERROR"),
          },
        },
      ],
    },
  ];

  return { cardConfig: config };
};
