import React from "react";
import { RenderRoutes } from "modules/common";

const PGR = ({ match, routes = [] }) => {
  return <RenderRoutes match={match} routes={routes} />;
};

export default PGR;
