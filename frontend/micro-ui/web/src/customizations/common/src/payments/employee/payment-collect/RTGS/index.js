import React, { useState, useEffect } from "react";
import { TextInput, SearchIconSvg, DatePicker, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
export const useRTGSDetails = (props, t) => {
  const config = [
    {
      head: t("PAYMENT_RTGS_HEAD"),
      headId: "paymentInfo",
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "paymentModeDetails",
            customProps: {},
            defaultValue: { instrumentNumber: "", instrumentDate: ""},
            component: (props, customProps) => <RTGSDetailsComponent onChange={props.onChange} rtgsDetails={props.value} {...customProps} />,
          },
        },
      ],
    },
  ];


  return { rtgsConfig: config };
};

// to be used in config

export const RTGSDetailsComponent = (props) => {
  const { t } = useTranslation();
  const [instrumentDate, setRTGSDate] = useState(props.rtgsDetails.instrumentDate);
  const [instrumentNumber, setRTGSNo] = useState(props.rtgsDetails.instrumentNumber);
  useEffect(() => {
    if (props.onChange) {
      let errorObj = {};
      if (!instrumentDate) errorObj.instrumentDate = "ES_COMMON_INSTRUMENT_DATE";
      if (!instrumentNumber) errorObj.instrumentNumber = "ES_COMMON_INSTR_NUMBER";
      props.onChange({ instrumentDate, instrumentNumber, errorObj, transactionNumber: instrumentNumber });
    }
  }, [  instrumentDate, instrumentNumber]);



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
              onChange={(e) => setRTGSNo(e.target.value)}
              required
              // minlength="6"
              // maxLength="6"
            />
          </div>
        </div>
      </div>
      <div className="label-field-pair">
        <h2 className="card-label">{t("TRANSACTION_DATE_DATE_LABEL")} *</h2>
        <div className="field">
          <div className="field-container">
            <DatePicker
              isRequired={true}
              date={instrumentDate}
              onChange={(d) => {
                setRTGSDate(d);
              }}
            />
          </div>
        </div>
      </div>     
    </React.Fragment>
  );
};
