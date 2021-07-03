import { Card } from "components";
import Icon from "egov-ui-kit/components/Icon";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";

export class Taskboard extends React.Component {
  state = {
    color: ""
  }

  render() {
    const { data, onSlaClick, color } = this.props
    return (
      <div className="inbox-taskboard">
        {data.map((item, i) => (
          <Card
            className={`inbox-card inbox-worklist-card inbox-worklist-card-hover-${i}`}
            key={i}
            onClick={() => onSlaClick(item.baseColor, item.body)}
            style={{ backgroundColor: item.color, borderTop: item.baseColor === color ? `4px solid ${color}` : "" }}
            textChildren={
              <div>
                {item.head != 'LOADING' && <div className="head">{item.head}</div>}
                {item.head == 'LOADING' && <Label labelClassName="inbox-taskboard-subtext" label={`CS_${item.head}`} />}
                <Label labelClassName="inbox-taskboard-subtext" label={item.body} />
              </div>
            }
          />
        ))}
      </div>
    );
  }
}

const onModuleCardClick = (route, setRoute) => {
  setRoute("/" + route);
};

const iconStyle = {
  width: "48px",
  height: "46.02px",
  color: "#fe7a51",
};

export const Boxboard = ({ data, setRoute }) => {
  return (
    <div className="inbox-module-container">
      {data.map((item, i) => {
        return (
          <div
            className="inbox-module-card"
            id={`emp-${item.displayName.split(" ")[0]}-card`}
            onClick={() => onModuleCardClick(item.navigationURL, setRoute)}
          >
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
