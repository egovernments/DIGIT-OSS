import React from "react";
import withAuthorization from "hocs/withAuthorization";
import withoutAuthorization from "hocs/withoutAuthorization";
import citizenRoutes from "./citizen";
import employeeRoutes from "./employee";

const mapRoutes = (routes) => {
  return routes.map((route, index) => {
    const { path, component, options, redirectionUrl, needsAuthentication } = route;
    return { ...route, component: needsAuthentication ? withAuthorization(options)(component) : withoutAuthorization(redirectionUrl)(component) };
  });
};

const routes = { citizen: mapRoutes(citizenRoutes), employee: mapRoutes(employeeRoutes) };
export default routes;
