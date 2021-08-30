import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

//Mock of an Auth method, can be replaced with an async call to the backend. Must return true or false
const isAuthenticated = () => {
  // call api to validate token
  return window.localStorage.getItem('token') ? true : false;
};

const base = '';
const PRIVATE_ROOT = base + '/prd/dashboard';
const PUBLIC_ROOT = base + '/';

const AuthRoute = ({ component, ...props }) => {
  const { isPrivate } = component;
  if (isAuthenticated()) {
    //User is Authenticated
    if (isPrivate == undefined || isPrivate == false) {
      //If the route is private the user may proceed.
      return <Route {...props} component={component} />;
    }
    // else {
    //   //If the route is public, the user is redirected to the app's private root.
    //   return <Redirect to={ PRIVATE_ROOT } />;
    // }
  } else {
    //User is not Authenticated
    if (isPrivate == undefined) {
      //If the route is private the user is redirected to the app's public root.
      return <Redirect to={PUBLIC_ROOT + localStorage.getItem('tenantId') || 'default'} />;
    } else {
      //If the route is public, the user may proceed.
      return <Route {...props} component={component} />;
    }
  }
};

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

export default AuthRoute;
