import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});

const LocalizationScreen = Loadable({
  loader: () => import("./LocalizationScreen"),
  loading: () => <Loading />
});

export {
  TestMolecules,
  LocalizationScreen
};
