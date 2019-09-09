import React from "react";
import { Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const addressStyle = {
  display: "inline-block"
};

const iconStyle = {
  display: "inline-block",
  // width: 45,
  // height: 28,
  marginRight: 7,
  marginTop: -3
};

const headerStyle = {
  letterSpacing: "0.7px"
};

const HeaderCard = ({ complaint }) => {
  let transformedcomplaint = "";
  if (complaint && complaint.header) {
    transformedcomplaint = "SERVICEDEFS." + complaint.header.toUpperCase();
  }

  const { houseNoAndStreetName, landmark, mohalla, city, locality } =
    complaint.address || "";
  return (
    <Card
      textChildren={[
        <Label
          key={1}
          label={transformedcomplaint}
          dark={true}
          bold={true}
          fontSize={16}
          labelStyle={headerStyle}
          containerStyle={{ marginBottom: 10 }}
        />,
        complaint && typeof complaint.address === "string" && (
          <div key={2} style={{ display: "flex", alignItems: "flex-start" }}>
            <Icon
              className="map-icon"
              action="maps"
              name="place"
              style={iconStyle}
              color={"#969696"}
            />
            <Label
              containerStyle={addressStyle}
              dark={true}
              label={complaint.address}
            />
          </div>
        ),
        complaint && typeof complaint.address === "object" && (
          <div className="rainmaker-displayInline">
            <div>
              <Icon
                className="map-icon"
                action="maps"
                name="place"
                style={iconStyle}
                color={"#969696"}
              />
            </div>
            <div className="complaint-address-display">
              <Label
                label={houseNoAndStreetName}
                className="status-result-color"
                id="complaint-details-complaint-location"
                labelStyle={{ color: "inherit" }}
              />
              {houseNoAndStreetName && (
                <Label
                  label={","}
                  className="comma-style"
                  id="complaint-details-complaint-location"
                  labelStyle={{ color: "inherit" }}
                  fontSize="16px"
                />
              )}
              <Label
                label={locality}
                className="status-result-color"
                id="complaint-details-complaint-location"
                labelStyle={{ color: "inherit" }}
              />
              <Label
                label={","}
                className="comma-style"
                id="complaint-details-complaint-location"
                labelStyle={{ color: "inherit" }}
                fontSize="16px"
              />
              <Label
                label={`TENANT_TENANTS_${city
                  .toUpperCase()
                  .replace(/[.]/g, "_")}`}
                className="status-result-color"
                id="complaint-details-complaint-location"
                labelStyle={{ color: "inherit" }}
              />
              {landmark && (
                <Label
                  label={","}
                  className="comma-style"
                  id="complaint-details-complaint-location"
                  labelStyle={{ color: "inherit" }}
                  fontSize="16px"
                />
              )}
              <Label
                label={landmark}
                className="status-result-color"
                id="complaint-details-complaint-location"
                labelStyle={{ color: "inherit" }}
              />
            </div>
          </div>
        )
      ]}
    />
  );
};

export default HeaderCard;
