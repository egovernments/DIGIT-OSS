import React from "react";
import { Notifications } from "modules/common";

const Updates = ({ notifications = [], history }) => {
  return <Notifications notifications={notifications} history={history} />;
};

export default Updates;
