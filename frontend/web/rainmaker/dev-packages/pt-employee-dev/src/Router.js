import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PT from "./Screens/index";

const Main = ({ routes }) => {
  return (
    <main>
      <Switch>
        <Route
          path={`/`}
          render={props => {
            return <PT match={props.match} routes={routes.pt} />;
          }}
        />
        {/* <Route exact path={`/image`} component={ImageModalDisplay} /> */}
        <Redirect from="/" to="/user/register" />
      </Switch>
    </main>
  );
};

export default Main;
