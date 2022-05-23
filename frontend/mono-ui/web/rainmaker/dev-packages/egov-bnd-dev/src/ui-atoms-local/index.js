import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestAtoms = Loadable({
  loader: () => import("./TestAtoms"),
  loading: () => <Loading />
});

const LinkButton = Loadable({
  loader: () => import("./LinkButton"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});

const Checkbox = Loadable({
  loader: () => import("./Checkbox"),
  loading: () => <Loading />
});

const UploadFile = Loadable({
  loader: () => import("./UploadFile"),
  loading: () => <Loading />
});

export {
  TestAtoms,
  LinkButton,
  AutoSuggest,
  Checkbox,
  UploadFile
};
