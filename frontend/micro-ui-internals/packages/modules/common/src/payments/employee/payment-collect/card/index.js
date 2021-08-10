import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useCardPaymentDetails = (props, t) => {
  const config = [
    {
      head: t("PAYMENT_CARD_HEAD"),
      headId: "paymentInfo",
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "paymentModeDetails",
            customProps: {},
            defaultValue: {},
            component: (props, customProps) => <CardDetailsComponent onChange={props.onChange} value={props.value} {...customProps} />,
          },
        },
      ],
    },
  ];

  return { cardConfig: config };
};

const CardDetailsComponent = ({ ...props }) => {
  const { t } = useTranslation();
  const [last4Digits, setLast4Digits] = useState(props?.value?.last4Digits);
  const [transactionNumber, setTransactionNumber] = useState(props?.value?.transactionNumber);
  const [reTransanctionNumber, setReTransanctionNumber] = useState(props?.value?.reTransanctionNumber);

  useEffect(() => {
    if (props.onChange) {
      let errorMsg = "";
      if (last4Digits.length !== 4) errorMsg = "ES_COMMON_ERROR_LAST_4_DIGITS";
      let errorObj = {};
      if (!last4Digits) errorObj.last4Digits = "ES_COMMON_LAST_4_DIGITS";
      if (!transactionNumber) errorObj.transactionNumber = "ES_COMMON_TRANSANCTION_NO";
      if (!reTransanctionNumber) errorObj.reTransanctionNumber = "ES_COMMON_RE_TRANSANCTION_NO";
      props.onChange({ transactionNumber, reTransanctionNumber, instrumentNumber: last4Digits, errorObj });
    }
  }, [last4Digits, transactionNumber, reTransanctionNumber]);

  return (
    <React.Fragment>
      <div className="label-field-pair">
        <h2 className="card-label">{`${t("NOC_PAYMENT_CARD_LAST_DIGITS_LABEL")} *`}</h2>
        <div className="field">
          <div className="field-container">
            <input
              className="employee-card-input"
              value={last4Digits}
              type="text"
              name="instrumentNumber"
              maxLength="4"
              minLength="4"
              required
              onChange={(e) => setLast4Digits(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="label-field-pair">
        <h2 className="card-label">{`${t("NOC_PAYMENT_TRANS_NO_LABEL")} *`}</h2>
        <div className="field">
          <div className="field-container">
            <input
              className="employee-card-input"
              value={transactionNumber}
              type="text"
              name="instrumentNumber"
              required
              onChange={(e) => setTransactionNumber(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="label-field-pair">
        <h2 className="card-label">{`${t("NOC_PAYMENT_RENTR_TRANS_LABEL")} *`}</h2>
        <div className="field">
          <div className="field-container">
            <input
              className="employee-card-input"
              value={reTransanctionNumber}
              type="text"
              name="instrumentNumber"
              required
              onChange={(e) => setReTransanctionNumber(e.target.value)}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
