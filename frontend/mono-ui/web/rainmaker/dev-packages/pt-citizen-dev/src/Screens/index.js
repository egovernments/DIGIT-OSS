import React from "react";
import { RenderRoutes } from "modules/common";

const PT = ({ match, routes = [] }) => {
  return <RenderRoutes match={match} routes={routes} />;
};

export default PT;
