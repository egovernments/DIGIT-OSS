import React from "react";
import { RenderRoutes } from "modules/common";

const Employee = ({ match, routes }) => {
  return <RenderRoutes match={match} routes={routes} />;
};

export default Employee;
