import React from "react";
import { useTranslation } from "react-i18next";
import { CardSubHeader, StatusTable, Row, CardSectionHeader } from "@egovernments/digit-ui-react-components";

function TLTradeUnits({ units }) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {units.map((unit, index) => (
        <div key={t(unit?.title)} style={{ marginTop: "19px", background: "#FAFAFA", border: "1px solid #D6D5D4", borderRadius: "4px", padding: "8px", lineHeight: "19px", width: "40%" }}>
          <CardSubHeader style={{ marginBottom: "8px", color: "#505A5F", fontSize: "24px" }}>{`${t(unit?.title)} ${index + 1}`}</CardSubHeader>
          <React.Fragment key={index}>
            <StatusTable style={{ position: "relative", padding: "8px" }}>
              <div
                style={{
                  position: "absolute",
                  maxWidth: "640px",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "auto"
                }}
              ></div>
              {unit?.values?.map((value, index) => {
                if (value.map === true && value.value !== "N/A") {
                  return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" />} />;
                }
                return (
                  <Row
                    key={t(value.title)}
                    label={`${t(value.title)}:`}
                    text={t(value.value) || "NA"}
                    last={index === value?.values?.length - 1}
                    caption={value.caption}
                    className="border-none"
                    rowContainerStyle={{justifyContent: "space-between"}}
                  />
                );
              })}
            </StatusTable>
          </React.Fragment>
        </div>
      ))}
    </React.Fragment>
  );
}

export default TLTradeUnits;
