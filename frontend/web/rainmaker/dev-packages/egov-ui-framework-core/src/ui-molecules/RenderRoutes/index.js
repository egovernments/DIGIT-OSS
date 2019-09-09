import React from "react";
import {Div} from "../../ui-atoms";
import { Redirect,Switch } from "react-router-dom";
import AppliedRoute from "../AppliedRoute";

const RenderRoutes = ({ basePath="", routes = [],childProps }) => {
  return (
    <Div>
      <Switch>
        {routes.map((route, index) => {
          if (route.isRedirect) {
            const { from, to } = route;
            return <Redirect key={index} from={from} to={to} />;
          } else {
            let { component: Component, path, isExact } = route;
            return (
              <AppliedRoute
                key={index}
                exact={isExact ? true : false}
                path={
                  basePath === ""
                    ? path
                    : basePath==="/"?path:`${basePath}${path}`
                }
                component={Component}
                props={childProps}
              />
            );
          }
        })}
      </Switch>
    </Div>
  );
};

export default RenderRoutes;
