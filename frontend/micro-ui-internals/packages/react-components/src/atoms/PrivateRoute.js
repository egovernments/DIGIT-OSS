import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = Digit.SessionStorage.get("User");
        console.log(user);
        if (!user || !user.token) {
          // not logged in so redirect to login page with the return url
          return <Redirect to={{ pathname: "/digit-ui/", state: { from: props.location } }} />;
        }

        // logged in so return component
        return <Component {...props} />;
      }}
    />
  );
};
