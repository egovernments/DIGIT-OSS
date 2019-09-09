import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PGR from "./Screens/index";

const Main = ({ routes }) => {
  return (
    <main>
      <Switch>
        <Route
          path={`/`}
          render={props => {
            return <PGR match={props.match} routes={routes.pgr} />;
          }}
        />
        {/* <Route exact path={`/image`} component={ImageModalDisplay} /> */}
        <Redirect from="/" to="/user/register" />
      </Switch>
    </main>
  );
};

export default Main;
