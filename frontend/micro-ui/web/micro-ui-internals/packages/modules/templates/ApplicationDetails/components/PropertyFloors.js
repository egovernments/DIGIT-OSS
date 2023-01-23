import React from "react";
import { useTranslation } from "react-i18next";
import { CardSubHeader, StatusTable, Row, CardSectionHeader } from "@egovernments/digit-ui-react-components";

function PropertyFloors({ floors }) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {floors.map((floor) => (
        <div key={t(floor?.title)} style={{ marginTop: "19px" }}>
          <CardSubHeader style={{ marginBottom: "8px", color: "#505A5F", fontSize: "24px" }}>{t(floor?.title)}</CardSubHeader>
          {floor?.values?.map((value, index) => {
            return (
              <React.Fragment key={index}>
                <CardSectionHeader style={{ marginBottom: "16px", color: "#505A5F", fontSize: "16px", marginTop: index !== 0 ? "16px" : "revert" }}>
                  {t(value.title)}
                </CardSectionHeader>
                <StatusTable style={{ position: "relative", padding: "8px" }}>
                  <div
                    style={{ border: "1px solid #D6D5D4", padding: "16px", marginTop: "8px", borderRadius: "4px", background: "#FAFAFA", maxWidth: "100%" }}
                  >
                  {value?.values?.map((value, index) => {
                    if (value.map === true && value.value !== "N/A") {
                      return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" />} />;
                    }
                    return (
                      <Row
                        key={t(value.title)}
                        label={t(value.title)}
                        text={t(value.value) || "N/A"}
                        last={index === value?.values?.length - 1}
                        caption={value.caption}
                        className="border-none"
                      />
                    );
                  })}
                  </div>
                </StatusTable>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </React.Fragment>
  );
}

export default PropertyFloors;
