import React from "react";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import Icon from "egov-ui-kit/components/Icon";

export const Taskboard = ({ data }) => {
  return (
    <div className="inbox-taskboard">
      {data.map((item, i) => (
        <Card
          className="inbox-card inbox-worklist-card"
          key={i}
          textChildren={
            <div>
              <div className="head">{item.head}</div>
              <Label labelClassName="inbox-taskboard-subtext" label={item.body} />
            </div>
          }
        />
      ))}
    </div>
  );
};

const onModuleCardClick = (route) => {
  const url = process.env.NODE_ENV === "production" ? `employee/${route}` : route;
  window.location.href = document.location.origin + "/" + url;
};

const iconStyle = {
  width: "48px",
  height: "46.02px",
};

export const Boxboard = ({ data }) => {
  return (
    <div className="inbox-module-container">
      {data.map((item, i) => {
        return (
          <div className="inbox-module-card" id={`emp-${item.displayName.split(" ")[0]}-card`} onClick={() => onModuleCardClick(item.navigationURL)}>
            <Card
              className="inbox-card inbox-card-top"
              key={i}
              textChildren={
                <div>
                  <div
                    style={{
                      marginTop: 20,
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
                      //defaultLabel={item.displayName}
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
  );
};
