import { CardSubHeader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

function PropertyOwners({ owners }) {
  const { t } = useTranslation();

  const checkLocation = true;
  const checkOwnerLength = owners?.length || 1;
  let cardStyles = { marginTop: "19px" };
  let statusTableStyles = { position: "relative", padding: "8px" };
  let rowContainerStyle = { justifyContent: "space-between", fontSize: "16px", lineHeight: "19px", color: "#0B0C0C" };
  if (checkLocation && Number(checkOwnerLength) > 1) {
    cardStyles = {
      marginTop: "19px",
      background: "#FAFAFA",
      border: "1px solid #D6D5D4",
      borderRadius: "4px",
      padding: "8px",
      lineHeight: "19px",
      maxWidth: "600px",
      minWidth: "280px",
    };
  } else if (checkLocation && !(Number(checkOwnerLength) > 1)) {
    cardStyles = { marginTop: "19px", lineHeight: "19px", maxWidth: "600px", minWidth: "280px" };
    statusTableStyles = { position: "relative", marginTop: "19px" };
  }

  if (window.location.href.includes("obps")) {
    cardStyles = { ...cardStyles, maxWidth: "950px" };
    cardStyles = { ...cardStyles, maxWidth: "950px" };
    rowContainerStyle = {};
  }

  return (
    <React.Fragment>
      {owners.map((owner, index) => (
        <div key={t(owner?.title)} style={cardStyles}>
          {/* TODO, Later will move to classes */}
          <CardSubHeader
            style={
              checkLocation && Number(checkOwnerLength) > 1
                ? { marginBottom: "8px", paddingBottom: "9px", color: "#0B0C0C", fontSize: "16px", lineHeight: "19px" }
                : { marginBottom: "8px", color: "#505A5F", fontSize: "24px" }
            }
          >
            {checkLocation && Number(checkOwnerLength) > 1 ? `${t(owner?.title)} ${index + 1}` : t(owner?.title)}
          </CardSubHeader>
          <React.Fragment key={index}>
            <StatusTable style={statusTableStyles}>
              <div
                style={{
                  maxWidth: "640px",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "auto",
                }}
              ></div>
              {owner?.values?.map((value, index) => {
                if (value.map === true && value.value !== "N/A") {
                  return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" privacy={value?.privacy} />} />;
                }
                return (
                  <span>
                    <Row
                      key={t(value.title)}
                      label={!checkLocation ? t(value.title) : `${t(value.title)}`}
                      text={t(value.value) || "N/A"}
                      last={index === value?.values?.length - 1}
                      caption={value.caption}
                      className="border-none"
                      textStyle={value.textStyle}
                      /*
                        Feature :: Privacy
                        privacy object set to the Row Component
                       */
                      privacy={value?.privacy}
                      // TODO, Later will move to classes
                      rowContainerStyle={rowContainerStyle}
                    />
                  </span>
                );
              })}
            </StatusTable>
          </React.Fragment>
        </div>
      ))}
    </React.Fragment>
  );
}

export default PropertyOwners;
