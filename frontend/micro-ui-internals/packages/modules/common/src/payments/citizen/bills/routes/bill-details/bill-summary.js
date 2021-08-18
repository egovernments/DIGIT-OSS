import React from "react";
import { useTranslation } from "react-i18next";

const BillSumary = ({ billAccountDetails, total, businessService, arrears }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <div className="bill-summary">
        {billAccountDetails
          .sort((a, b) => a.order - b.order)
          .map((amountDetails, index) => {
            return (
              <div key={index} className="bill-account-details">
                <div className="label">{t(amountDetails.taxHeadCode)}</div>
                <div className="value">₹ {amountDetails.amount?.toFixed(2)}</div>
              </div>
            );
          })}

        {
          <div className="bill-account-details">
            <div className="label">{t("COMMON_ARREARS")}</div>
            <div className="value">₹ {arrears?.toFixed?.(2) || Number(0).toFixed(2)}</div>
          </div>
        }

        <hr className="underline" />
        <div className="amount-details">
          <div className="label">{t("CS_PAYMENT_TOTAL_AMOUNT")}</div>
          <div className="value">₹ {Number(total)}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BillSumary;
