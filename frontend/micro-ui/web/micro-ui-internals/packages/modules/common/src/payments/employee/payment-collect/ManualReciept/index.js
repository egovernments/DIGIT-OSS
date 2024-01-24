import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, SearchIconSvg, DatePicker } from "@egovernments/digit-ui-react-components";

export const useCashPaymentDetails = (props, t) => {
  const config = [
    {
      head: t("NOC_PAYMENT_RCPT_DETAILS"),
      headId: "paymentInfo",
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "ManualRecieptDetails",
            customProps: {},
            defaultValue: { manualReceiptNumber: "", manualReceiptDate: "" },
            component: (props, customProps) => <CashDetailsComponent {...customProps} onChange={props.onChange} value={props.value} />,
          },
        },
      ],
    },
  ];

  return { cashConfig: config };
};

const CashDetailsComponent = ({ ...props }) => {
  const { t } = useTranslation();
  const [manualReceiptDate, setManualReceiptDate] = useState(props?.value?.manualReceiptDate);
  const [manualReceiptNumber, setManualReceiptNumber] = useState(props?.value?.manualReceiptNumber);
  const isFSM = window?.location.pathname.includes("FSM");

  useEffect(() => {
    if (props.onChange) {
      let errorObj = {};
      if (!manualReceiptDate) errorObj.manualReceiptDate = "ES_COMMON_MANUAL_RECEIPT_DATE";
      if (!manualReceiptNumber) errorObj.manualReceiptNumber = "ES_COMMON_MANUAL_RECEIPT_NO";

      props.onChange({ manualReceiptNumber, manualReceiptDate, errorObj });
    }
  }, [manualReceiptDate, manualReceiptNumber]);

  return (
    <React.Fragment>
      <div className="label-field-pair">
        <h2 className="card-label">{t("NOC_PAYMENT_RCPT_NO_LABEL")}</h2>
        <div className="field">
          <div className="field-container">
            <input
              className="employee-card-input"
              value={manualReceiptNumber}
              type="text"
              name="instrumentNumber"
              onChange={(e) => setManualReceiptNumber(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="label-field-pair">
        <h2 className="card-label">{t("NOC_PAYMENT_RECEIPT_ISSUE_DATE_LABEL")} </h2>
        <div className="field">
          <div className="field-container">
            <DatePicker
              date={manualReceiptDate}
              onChange={(d) => {
                setManualReceiptDate(d);
              }}
              min={isFSM ? Digit.Utils.date.getDate(Date.now() - 30 * 24 * 60 * 60 * 1000) : null}
              max={isFSM ? Digit.Utils.date.getDate() : null}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
