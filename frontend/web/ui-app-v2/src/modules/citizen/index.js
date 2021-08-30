import React from "react";
import RenderRoutes from "modules/common/common/RenderRoutes";

const Citizen = ({ match, routes = [] }) => {
  return <RenderRoutes match={match} routes={routes} />;
};

export default Citizen;
