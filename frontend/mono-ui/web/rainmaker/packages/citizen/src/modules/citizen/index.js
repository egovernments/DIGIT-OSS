import React from "react";
import { RenderRoutes } from "modules/common";

const Citizen = ({ match, routes = [] }) => {
  return <RenderRoutes match={match} routes={routes} />;
};

export default Citizen;
