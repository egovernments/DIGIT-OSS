import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Employee from "modules/employee";

const Main = ({ routes, hasLocalisation, defaultUrl }) => {
  return (
    <main>
      <Switch>
        <Route
          path={`/`}
          render={(props) => {
            return <Employee match={props.match} routes={routes.employee} />;
          }}
        />

        <Redirect from="/" to={hasLocalisation ? "/language-selection" : defaultUrl.employee} />
      </Switch>
    </main>
  );
};

export default Main;
