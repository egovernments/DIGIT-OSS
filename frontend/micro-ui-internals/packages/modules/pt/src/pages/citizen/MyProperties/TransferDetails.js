import React from "react";
import { Row, StatusTable } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const returnTransferData = (value) => {
  const { t } = useTranslation();
  return Object.keys(value).map((key) => {
    return (
      <div>
        <Row label={t(key)} text={`${value[key] || "NA"}`} />
      </div>
    );
  });
};

const TransferDetails = ({ data }) => {
  return (
    <div style={{ borderLeft: "2px solid rgba(0, 0, 0, 0.12)", marginTop: "-5px", paddingLeft: "5px", paddingTop: "10px" }}>
      {data.map((value, index) => {
        return (
          <div>
            {index !== 0 && <div style={{ backgroundColor: "rgba(0, 0, 0, 0.12)", width: "auto", height: "2px", marginLeft: "16px" }}></div>}
            <StatusTable>{returnTransferData(value)}</StatusTable>
          </div>
        );
      })}
    </div>
  );
};

export default TransferDetails;
