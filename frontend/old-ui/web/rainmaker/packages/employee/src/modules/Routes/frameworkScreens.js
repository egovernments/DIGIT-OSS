import React from "react";
import Loadable from "react-loadable";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";

const Loading = () => <LoadingIndicator />;

const ScreenInterface = Loadable({
  loader: () => import("../../ui-views/ScreenInterface"),
  loading: Loading,
});

const routes = [
  {
    path: ":path/:screenKey",
    component: ScreenInterface,
    needsAuthentication: true,
    options: {
      title: "",
      hideFooter: true,
      hideTitle: true,
      hideBackButton: true,
      isHomeScreen: true,
    }
  },
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
];

export default routes;
