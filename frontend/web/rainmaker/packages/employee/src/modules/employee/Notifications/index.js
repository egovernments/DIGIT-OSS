import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import { Card } from "components";
import Icon from "egov-ui-kit/components/Icon";
import "./index.css";

const items = [
  {
    displayName: "Public Message Broadcast",
    navigationURL: "notifications/search",
    leftIcon: "action:record-voice-over",
  },
  {
    displayName: "Events",
    navigationURL: "events/search",
    leftIcon: "action:date-range",
  },
];

const iconStyle = {
  width: "40px",
  height: "40px",
};

const onModuleCardClick = (route) => {
  const url = process.env.NODE_ENV === "production" ? `employee/${route}` : route;
  window.location.href = window.origin + "/" + url;
};

const EmployeeNotification = () => {
  return (
    <div>
      <div style={{ marginLeft: 35, marginTop: 20 }}>
        <Label label="ULB Information" color="rgba(0, 0, 0, 0.87)" fontSize="24px" containerStyle={{ marginBottom: 30 }} />
        <Label label="Communication" color="rgba(0, 0, 0, 0.87)" fontSize="16px" />
      </div>
      {items && (
        <div className="inbox-module-container">
          {items.map((item, i) => {
            return (
              <div
                style={{ marginRight: 20 }}
                id={`emp-${item.displayName.split(" ")[0]}-card`}
                onClick={() => onModuleCardClick(item.navigationURL)}
              >
                <Card
                  className="events-card"
                  key={i}
                  textChildren={
                    <div>
                      <div
                        style={{
                          marginTop: 15,
                        }}
                        className="head"
                      >
                        <Icon action={item.leftIcon.split(":")[0]} name={item.leftIcon.split(":")[1]} style={iconStyle} />
                      </div>
                      <div
                        style={{
                          marginTop: 20,
                        }}
                        className="body"
                      >
                        <Label
                          label={`ACTION_TEST_${item.displayName.toUpperCase().replace(/[.:-\s\/]/g, "_")}`}
                          color="rgba(0, 0, 0, 0.87)"
                          className="inbox-card-top-label"
                        />
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeNotification;
