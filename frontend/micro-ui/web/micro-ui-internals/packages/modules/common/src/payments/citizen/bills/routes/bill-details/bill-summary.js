import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const BillSumary = ({ billAccountDetails, total, businessService, arrears }) => {
  const { t } = useTranslation();
  const { workflow: ModuleWorkflow } = Digit.Hooks.useQueryParams();

  useEffect(() => {
    ModuleWorkflow === "mcollect" && billAccountDetails && billAccountDetails.map((ob) => {
      if(ob.taxHeadCode.includes("CGST"))
        ob.order = 3;
      else if(ob.taxHeadCode.includes("SGST"))
        ob.order = 4;
    })
  },[billAccountDetails])
  return (
    <React.Fragment>
      <div className="bill-summary">
        {billAccountDetails
          .sort((a, b) => a.order - b.order)
          .map((amountDetails, index) => {
            return (
              <div key={index} className="bill-account-details">
                <div className="label">{t(amountDetails.taxHeadCode)}</div>
                <div className="value">₹ {Math.abs(amountDetails?.amount?.toFixed(2))}</div>
              </div>
            );
          })}

        {
          <div className="bill-account-details">
            <div className="label">{t("COMMON_ARREARS")}</div>
            <div className="value">₹ {Math.abs(arrears?.toFixed?.(2) || Number(0).toFixed(2))}</div>
          </div>
        }

        <hr className="underline" />
        <div className="amount-details">
          <div className="label">{t("CS_PAYMENT_TOTAL_AMOUNT")}</div>
          <div className="value">₹ {Number(total).toFixed(2)}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BillSumary;
