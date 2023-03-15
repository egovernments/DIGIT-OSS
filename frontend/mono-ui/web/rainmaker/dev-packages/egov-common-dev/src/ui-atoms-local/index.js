import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestAtoms = Loadable({
  loader: () => import("./TestAtoms"),
  loading: () => <Loading />
});
const ArrearTable = Loadable({
  loader: () => import("./ArrearTable"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});
const ApplicationNoContainer = Loadable({
  loader: () => import("./ApplicationNo"),
  loading: () => <Loading />
});
const OthersContainer = Loadable({
  loader: () => import("./OthersContainer"),
  loading: () => <Loading />
});
const DisabledComponent = Loadable({
  loader: () => import("./DisabledComponent"),
  loading: () => <Loading />
});

const LinkComponent = Loadable({
  loader: () => import("./LinkComponent"),
  loading: () => <Loading />
});


export {
  LinkComponent,
  TestAtoms,
  ArrearTable,
  AutoSuggest,
  ApplicationNoContainer,
  DisabledComponent,
  OthersContainer
};
