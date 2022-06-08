import React from "react";
import { Route, Switch } from "react-router-dom";
import Citizen from "modules/citizen";
import Employee from "modules/employee";
import ImageModalDisplay from "modules/common/common/ImageModalDisplay";

const Main = ({ routes }) => {
  return (
    <main>
      <Switch>
        <Route
          path={`/citizen/`}
          render={(props) => {
            return <Citizen match={props.match} routes={routes.citizen} />;
          }}
        />
        <Route
          path={`/employee/`}
          render={(props) => {
            return <Employee match={props.match} routes={routes.employee} />;
          }}
        />
        <Route path={`/image`} component={ImageModalDisplay} />
      </Switch>
    </main>
  );
};

export default Main;
