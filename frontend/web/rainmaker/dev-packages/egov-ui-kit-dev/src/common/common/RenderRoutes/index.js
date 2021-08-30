import React from "react";
import { Route, Switch } from "react-router-dom";

const RenderRoutes = ({ match, routes = [] }) => {
  return (
    <Switch>
      {routes.map((route, index) => {
        let { component: Component, path } = route;
        return (
          <Route
            key={index}
            exact
            path={match.path === "/" ? (path === "/" ? "/" : `/${path}`) : `${baseUrl}/${path}`}
            render={(props) => {
              return <Component {...props} />;
            }}
          />
        );
      })}
    </Switch>
  );
};

export default RenderRoutes;
