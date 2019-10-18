import React from "react";
import Loadable from "react-loadable";
const Loading = () => <div />;

const ScreenInterface = Loadable({
  loader: () => import("../../ui-views/ScreenInterface"),
  loading: Loading,
});

const routes = [
  {
    path: "withoutAuth/:path/:screenKey",
    component: ScreenInterface,
    needsAuthentication: false,
    options: {
      title: "",
      hideFooter: true,
      hideTitle: true,
      hideBackButton: true,
      isHomeScreen: true,
    },
  },

  {
    path: ":path/:screenKey",
    component: ScreenInterface,
    needsAuthentication: true,
    options: {
      title: "",
      hideFooter: true,
      hideTitle: true,
      helpButton: window.location.pathname === "/tradelicense-citizen/home" ? true : false,
    },
  },
];

export default routes;
