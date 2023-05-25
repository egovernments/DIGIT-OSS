import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const YearWiseBilltable = ({ bill, ...props }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(true);
  const yearWiseBills = bill?.billDetails?.sort((a, b) => b.fromPeriod - a.fromPeriod);

  const getFinancialYear = (_bill) => {
    const { fromPeriod, toPeriod } = _bill;
    let from = new Date(fromPeriod).getFullYear().toString();
    let to = new Date(toPeriod).getFullYear().toString();
    return from + "-" + to.slice(-2);
  };

  const thStyle = { whiteSpace: "break-spaces", paddingBottom: "13px" };

  return (
    <React.Fragment>
      {showDetails ? (
        <div>
          <div style={{ backgroundColor: "#EEEEEE" }} className="scroll-table-wrapper">
            <div className="scroll-table-width-wrapper">
              <table style={{ borderCollapse: "separate" }}>
                {
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, paddingTop: "14px" }} className="first-col">
                        {t("ES_FINANCIAL_YEAR")}
                      </th>
                      {yearWiseBills?.[0]?.billAccountDetails
                        ?.sort((a, b) => a.order - b.order)
                        ?.map((head, index) => (
                          <th style={{ ...thStyle, borderBottom: "#D6D5D4 1px solid", padding: "0 5px" }} key={index}>
                            {t(head.taxHeadCode)}
                          </th>
                        ))}
                      <th style={{ ...thStyle, paddingTop: "14px", whiteSpace: "break-spaces" }} className="last-col">
                        {t("ES_TOTAL_TAX").split(" ")[0] + "\n" + t("ES_TOTAL_TAX").split(" ")[1]}
                      </th>
                    </tr>
                  </thead>
                }
                <tbody>
                  {yearWiseBills?.map((bill, ind) => {
                    const sorted_tax_heads = bill?.billAccountDetails?.sort((a, b) => a.order - b.order);
                    return (
                      <tr>
                        <td className="first-col">{getFinancialYear(bill)}</td>
                        {sorted_tax_heads.map((e, i) => (
                          <td key={i}>{e.amount}</td>
                        ))}
                        <td className="last-col">{bill.amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ textAlign: "right" }} onClick={() => setShowDetails(false)} className="filter-button">
            {t("ES_COMMON_HIDE_DETAILS")}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "right" }} onClick={() => setShowDetails(true)} className="filter-button">
          {t("ES_COMMON_VIEW_DETAILS")}
        </div>
      )}
    </React.Fragment>
  );
};
export default YearWiseBilltable;
