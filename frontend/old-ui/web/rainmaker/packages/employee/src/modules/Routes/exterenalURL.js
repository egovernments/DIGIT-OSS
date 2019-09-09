import React from "react";
import Loadable from "react-loadable";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";

const Loading = () => <LoadingIndicator />;

const IFrameInterface = Loadable({
  loader: () => import("../../ui-views/IFrameInterface"),
  loading: Loading,
});

const routes = [
  // property tax routes
  {
    path: "integration/:moduleName/:pageName",
    component: IFrameInterface,
    needsAuthentication: true,
    options: {
      hideTitle: true,
      title: "",
      hideFooter: true,
      hideBackButton: true,
      isHomeScreen: true,
    },
  },
];

export default routes;
