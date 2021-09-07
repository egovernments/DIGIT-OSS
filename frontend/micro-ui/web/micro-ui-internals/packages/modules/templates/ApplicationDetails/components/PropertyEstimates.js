import React from "react";
import { useTranslation } from "react-i18next";
import { StatusTable, Row, BreakLine } from "@egovernments/digit-ui-react-components";

function PropertyEstimates({ taxHeadEstimatesCalculation }) {
  const { taxHeadEstimates } = taxHeadEstimatesCalculation;
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: "40px" }}>
      <StatusTable>
        <Row label={t("ES_PT_TITLE_TAX_HEADS")} text={t("ES_PT_TITLE_AMOUNT")} className="border-none" textStyle={{ fontWeight: "bold" }} />
        <BreakLine style={{ margin: "16px 0", width: "40%" }} />
        {taxHeadEstimates?.map((estimate, index) => {
          return (
            <Row
              key={t(estimate.taxHeadCode)}
              label={t(estimate.taxHeadCode)}
              text={`₹ ${estimate.estimateAmount}` || "N/A"}
              last={index === taxHeadEstimates?.length - 1}
              className="border-none"
              textStyle={{ color: "#505A5F" }}
              labelStyle={{ color: "#505A5F" }}
            />
          );
        })}
        <BreakLine style={{ margin: "16px 0", width: "40%" }} />
        <Row
          label={t("ES_PT_TITLE_TOTAL_DUE_AMOUNT")}
          text={`₹ ${taxHeadEstimatesCalculation?.totalAmount}` || "N/A"}
          className="border-none"
          textStyle={{ fontSize: "24px", fontWeight: "bold" }}
        />
      </StatusTable>
    </div>
  );
}

export default PropertyEstimates;
