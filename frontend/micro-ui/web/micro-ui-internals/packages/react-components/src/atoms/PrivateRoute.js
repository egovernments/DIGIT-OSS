import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = Digit.UserService.getUser();
        const userType = Digit.UserService.getType();
        function getLoginRedirectionLink (){
          if(userType === "employee"){
            return "/digit-ui/employee/user/language-selection"
          }
          else{
            return "/digit-ui/citizen/login"
          }
        }
        if (!user || !user.access_token) {
          // not logged in so redirect to login page with the return url
          return <Redirect to={{ pathname: getLoginRedirectionLink(), state: { from: props.location.pathname + props.location.search } }} />;
        }

        // logged in so return component
        return <Component {...props} />;
      }}
    />
  );
};
