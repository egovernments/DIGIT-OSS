import React from "react";
import { Card, Icon, Button } from "components";
import Label from "utils/translationNode";
import "./index.css";

const Updates = ({ notifications = [] }) => {
  const renderUpdate = (notification, index) => {
    const { title, date, status, amountDue, dueDate } = notification;
    return (
      <Card
        className="home-notification"
        style={{ margin: "8px 0px" }}
        key={index}
        id={`home-notification${index}`}
        style={{ padding: "12px 8px" }}
        textChildren={
          <div className="update">
            <div className="notification-top-content">
              <Label
                leftWrapperStyle
                fontSize={16}
                dark={true}
                bold={true}
                label={title}
                containerStyle={{ width: "80%" }}
                labelStyle={{ width: "100%", wordWrap: "break-word" }}
              />
              <Icon style={{ color: "#fe7a51" }} action="custom" name="water-tap" />
            </div>
            <div className="complaint-date-cont">
              <Icon action="action" name="date-range" />
              <span className="complaint-date">{date}</span>
            </div>
            <div>
              <Label label="Amount due :" containerStyle={{ display: "inline-block" }} />
              <Label label={amountDue} labelStyle={{ paddingLeft: "5px" }} containerStyle={{ display: "inline-block" }} />
            </div>
            <div className="notification-top-content">
              <div>
                <Label label="Due Date :" containerStyle={{ display: "inline-block" }} />
                <Label label={dueDate} labelStyle={{ paddingLeft: "5px" }} containerStyle={{ display: "inline-block" }} />
              </div>
              <div className="pay-button-cont">
                <Button
                  id="home-notification-pay-button"
                  primary={true}
                  style={{
                    height: "22px",
                    lineHeight: "auto",
                    minWidth: "inherit",
                    width: "72px",
                  }}
                  label={<Label buttonLabel={true} fontSize="12px" label="PAY" />}
                  fullWidth={true}
                  onClick={this.continueComplaintSubmit}
                />
              </div>
            </div>
          </div>
        }
      />
    );
  };

  return <div>{notifications.map((notification, index) => renderUpdate(notification, index))}</div>;
};

export default Updates;
