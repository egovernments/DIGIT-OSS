import React from "react";
import { Divider, Icon } from "components";
import Label from "utils/translationNode";
import Screen from "modules/common/common/Screen";
import "./index.css";

const Updates = ({ notifications = [] }) => {
  const renderUpdate = (notification, index) => {
    const { title, days, icon } = notification;
    return (
      <div>
        <div className="notification-main-cont">
          <div className="notification-left-cont">{icon}</div>
          <div className="notification-right-cont">
            <Label label={title} />
            <Label label={days} fontSize="12px" />
          </div>
        </div>
        {notifications &&
          !(index === notifications.length - 1) && <Divider className="reciept-divider" inset={true} lineStyle={{ marginLeft: 0, marginRight: 0 }} />}
      </div>
    );
  };

  return <div>{notifications.map((notification, index) => renderUpdate(notification, index))}</div>;
};

export default Updates;
