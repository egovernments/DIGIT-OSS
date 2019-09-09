import React from "react";
import RenderRoutes from "modules/common/common/RenderRoutes";

const Employee = ({ match, routes }) => {
  return <RenderRoutes match={match} routes={routes} />;
};

export default Employee;
