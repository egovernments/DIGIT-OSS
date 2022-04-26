import React, { useState, useEffect } from "react";
import { TextInput, SearchIconSvg, DatePicker, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
export const useChequeDetails = (props, t) => {
  const config = [
    {
      head: t("PAYMENT_CHEQUE_HEAD"),
      headId: "paymentInfo",
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "paymentModeDetails",
            customProps: {},
            defaultValue: { instrumentNumber: "", instrumentDate: "", ifscCode: "", bankName: "", bankBranch: "" },
            component: (props, customProps) => <ChequeDetailsComponent onChange={props.onChange} chequeDetails={props.value} {...customProps} />,
          },
        },
      ],
    },
  ];

  return { chequeConfig: config };
};

// to be used in config

export const ChequeDetailsComponent = (props) => {
  const { t } = useTranslation();
  const [instrumentDate, setChequeDate] = useState(props.chequeDetails.instrumentDate);
  const [instrumentNumber, setChequeNo] = useState(props.chequeDetails.instrumentNumber);
  const [ifscCode, setIfsc] = useState(props.chequeDetails.ifscCode);
  const [ifscCodeError, setIfscCodeError] = useState("");
  const [bankName, setBankName] = useState(props.chequeDetails.bankName);
  const [bankBranch, setBankBranch] = useState(props.chequeDetails.bankBranch?.replace("┬á", " "));
  useEffect(() => {
    if (props.onChange) {
      let errorObj = {};
      if (!instrumentDate) errorObj.instrumentDate = "ES_COMMON_INSTRUMENT_DATE";
      if (!instrumentNumber) errorObj.instrumentNumber = "ES_COMMON_INSTR_NUMBER";
      if (!ifscCode) errorObj.ifscCode = "ES_COMMON_IFSC";
      props.onChange({ instrumentDate, instrumentNumber, ifscCode, bankName, bankBranch, errorObj, transactionNumber: instrumentNumber });
    }
  }, [bankName, bankBranch, instrumentDate, instrumentNumber]);

  const setBankDetailsFromIFSC = async () => {
    try {
      const res = await window.fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      if (res.ok) {
        const { BANK, BRANCH } = await res.json();
        setBankName(BANK);
        setBankBranch(BRANCH?.replace("┬á", " "));
      } else setIfscCodeError(t("CS_PAYMENT_INCORRECT_IFSC_CODE_ERROR"));
    } catch (er) {
      setIfscCodeError(t("CS_PAYMENT_INCORRECT_IFSC_CODE_ERROR"));
    }
  };

  const handleIFSCChange = (e) => {
    setIfsc(e.target.value);
    setIfscCodeError("");
  }

  return (
    <React.Fragment>
      <div className="label-field-pair">
        <h2 className="card-label">{t("PAYMENT_CHQ_NO_LABEL")} *</h2>
        <div className="field">
          <div className="field-container">
            <input
              className="employee-card-input"
              value={instrumentNumber}
              type="text"
              name="instrumentNumber"
              onChange={(e) => setChequeNo(e.target.value)}
              required
              // minlength="6"
              // maxLength="6"
            />
          </div>
        </div>
      </div>
      <div className="label-field-pair">
        <h2 className="card-label">{t("PAYMENT_CHEQUE_DATE_LABEL")} *</h2>
        <div className="field">
          <div className="field-container">
            <DatePicker
              isRequired={true}
              date={instrumentDate}
              onChange={(d) => {
                setChequeDate(d);
              }}
            />
          </div>
        </div>
      </div>
      {
        // chequeDate && chequeNo &&
        <React.Fragment>
          <div className="label-field-pair">
            <h2 className="card-label">{t("PAYMENT_IFSC_CODE_LABEL")} *</h2>
            <div className="field">
              <div>
                <div className="cheque-date">
                  <input value={ifscCode} type="text" onChange={handleIFSCChange} minlength="11" maxlength="11" required />
                  <button type="button" onClick={setBankDetailsFromIFSC}>
                    <SearchIconSvg />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {ifscCodeError && <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>{ifscCodeError}</CardLabelError>}
          <div className="label-field-pair">
            <h2 className="card-label">{t("PAYMENT_BANK_NAME_LABEL")}</h2>
            <div className="field">
              <div className="field-container">
                <input
                  // style={{ border: "2px solid #0b0c0c", borderRadius: "2px" }}
                  className="employee-card-input"
                  value={bankName}
                  type="text"
                  className="employee-card-input"
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="label-field-pair">
            <h2 className="card-label">{t("PAYMENT_BANK_BRANCH_LABEL")}</h2>
            <div className="field">
              <div className="field-container">
                <input className="employee-card-input" value={bankBranch} type="text" className="employee-card-input" readOnly disabled />
              </div>
            </div>
          </div>
        </React.Fragment>
      }
    </React.Fragment>
  );
};
