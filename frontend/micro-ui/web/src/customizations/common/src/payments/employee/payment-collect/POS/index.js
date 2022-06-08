import React, { useState, useEffect } from "react";
import { TextInput, SearchIconSvg, DatePicker, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
export const usePOSDetails = (props, t) => {
  const config = [
    {
      head: t("PAYMENT_POS_HEAD"),
      headId: "paymentInfo",
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "paymentModeDetails",
            customProps: {},
            defaultValue: { instrumentNumber: ""},
            component: (props, customProps) => <POSDetailsComponent onChange={props.onChange} posDetails={props.value} {...customProps} />,
          },
        },
      ],
    },
  ];


  return { posConfig: config };
};

// to be used in config

export const POSDetailsComponent = (props) => {
  const { t } = useTranslation();
  const [instrumentNumber, setPOSNo] = useState(props.posDetails.instrumentNumber);
   useEffect(() => {
    if (props.onChange) {
      let errorObj = {};
      if (!instrumentNumber) errorObj.instrumentNumber = "ES_COMMON_INSTR_NUMBER";
      props.onChange({  instrumentNumber,  errorObj, transactionNumber: instrumentNumber });
    }
  }, [ instrumentNumber]);


  return (
    <React.Fragment>
      <div className="label-field-pair">
        <h2 className="card-label">{t("TRANSACTION_NO_LABEL")} *</h2>
        <div className="field">
          <div className="field-container">
            <input
              className="employee-card-input"
              value={instrumentNumber}
              type="text"
              name="instrumentNumber"
              onChange={(e) => setPOSNo(e.target.value)}
              required
              // minlength="6"
              // maxLength="6"
            />
          </div>
        </div>
      </div>
     
    </React.Fragment>
  );
};
