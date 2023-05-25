import React from "react";
import { Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import {
  getDateFromEpoch,
  displayLocalizedStatusMessage
} from "egov-ui-kit/utils/commons";
import "./index.css";

const Updates = ({ updates, history }) => {
  const renderUpdate = (update, index) => {
    const { title, date, status, action } = update;
    let transformedstatus = "";
    const titleKey = title && "SERVICEDEFS." + title.toUpperCase();
    if (status) {
      if (status === "open" && action && action === "reopen") {
        transformedstatus = displayLocalizedStatusMessage("reopened");
      } else if (status === "assigned" && action && action === "reassign") {
        transformedstatus = displayLocalizedStatusMessage("reassigned");
      } else {
        transformedstatus = displayLocalizedStatusMessage(status);
      }
    }

    return (
      <Card
        style={{ margin: "8px 0px" }}
        key={index}
        id={`home-notification${index}`}
        textChildren={
          <div
            className="update"
            onClick={() => {
              history.push(
                `/complaint-details/${encodeURIComponent(update.number)}`
              );
            }}
          >
            <div className="notification-top-content">
              <Label
                leftWrapperStyle
                fontSize={16}
                dark={true}
                bold={true}
                label={titleKey}
                containerStyle={{ width: "80%" }}
                labelStyle={{ width: "100%", wordWrap: "break-word" }}
              />
              <Icon
                style={{ color: "#fe7a51" }}
                action="social"
                name="notifications-none"
              />
            </div>
            <div
              className="notification-top-content"
              style={{ justifyContent: "flex-start" }}
            >
              <Icon
                style={{ width: "16px", height: "16px" }}
                action="custom"
                name="calendar"
              />
              <Label
                fontSize={12}
                label={getDateFromEpoch(date)}
                labelStyle={{ paddingLeft: "5px" }}
                containerStyle={{ display: "inline-block" }}
              />
            </div>
            <div className="complaint-status" style={{ marginTop: "16px" }}>
              <Label
                containerStyle={{ display: "inline-block", marginLeft: "4px" }}
                dark={true}
                label={transformedstatus}
              />
            </div>
          </div>
        }
      />
    );
  };

  return (
    <div>{updates.map((update, index) => renderUpdate(update, index))}</div>
  );
};

export default Updates;
