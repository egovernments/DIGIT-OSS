import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ArrearTable from "./arrear-table";

const styles = {
  buttonStyle: { display: "flex", justifyContent: "flex-end", color: "#f47738" },
  headerStyle: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "24px",
    color: " rgba(11, 12, 12, var(--text-opacity))",
  },
};

const ArrearSummary = ({ bill = {} }) => {
  const { t } = useTranslation();
  const formatTaxHeaders = (billDetail = {}) => {
    let formattedFees = {};
    const { billAccountDetails = [] } = billDetail;
    billAccountDetails.map((taxHead) => {
      formattedFees[taxHead.taxHeadCode] = { value: taxHead.amount, order: taxHead.order };
    });
    formattedFees["CS_BILL_NO"] = { value: billDetail?.billNumber || "NA", order: -2 };
    formattedFees["CS_BILL_DUEDATE"] = {
      value: (billDetail?.expiryDate && new Date(billDetail?.expiryDate).toLocaleDateString()) || "NA",
      order: -1,
    };
    formattedFees["TL_COMMON_TOTAL_AMT"] = { value: billDetail.amount, order: 10 };
    return formattedFees;
  };

  const getFinancialYears = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (toDate.getYear() - fromDate.getYear() != 0) {
      return `FY${fromDate.getYear() + 1900}-${toDate.getYear() - 100}`;
    }
    return `${fromDate.toLocaleDateString()}-${toDate.toLocaleDateString()}`;
  };

  let fees = {};
  let sortedBillDetails = bill?.billDetails?.sort((a, b) => b.fromPeriod - a.fromPeriod) || [];
  sortedBillDetails = [...sortedBillDetails];
  const arrears = sortedBillDetails?.reduce((total, current, index) => (index === 0 ? total : total + current.amount), 0) || 0;
  let arrearsAmount = `₹ ${arrears?.toFixed?.(0) || Number(0).toFixed(0)}`;

  sortedBillDetails.shift();
  sortedBillDetails.map((bill) => {
    let fee = formatTaxHeaders(bill);
    fees[getFinancialYears(bill.fromPeriod, bill.toPeriod)] = fee;
  });

  let head = {};
  fees
    ? Object.keys(fees).map((key, ind) => {
        let value = [];
        Object.keys(fees[key]).map((key1) => {
          head[key1] = (fees[key] && fees[key][key1] && fees[key][key1].order) || 0;
        });
      })
    : "NA";
  let keys = [];

  keys = Object.keys(head);
  keys.sort((x, y) => head[x] - head[y]);

  const [showArrear, setShowArrear] = useState(false);

  if (arrears == 0 || arrears < 0) {
    return <span></span>;
  }
  return (
    <React.Fragment>
      <div style={styles.headerStyle}>{t("CS_ARREARS_DETAILS")}</div>
      {showArrear && <ArrearTable headers={[...keys]} values={fees} arrears={arrearsAmount}></ArrearTable>}
      {!showArrear && (
        <div style={styles.buttonStyle}>
          <button
            type="button"
            onClick={() => {
              setShowArrear(true);
            }}
          >
            {t("CS_SHOW_CARD")}
          </button>
        </div>
      )}
      {showArrear && (
        <div style={styles.buttonStyle}>
          <button
            type="button"
            onClick={() => {
              setShowArrear(false);
            }}
          >
            {t("CS_HIDE_CARD")}
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default ArrearSummary;
