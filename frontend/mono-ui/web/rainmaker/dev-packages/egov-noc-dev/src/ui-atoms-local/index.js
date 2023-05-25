import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const TestAtoms = Loadable({
  loader: () => import("./TestAtoms"),
  loading: () => <Loading />
});

const UploadedDocument = Loadable({
  loader: () => import("./UploadedDocument"),
  loading: () => <Loading />
});

const NocNumber = Loadable({
  loader: () => import("./NocNumber"),
  loading: () => <Loading />
});

export {
  TestAtoms,
  UploadedDocument,
  NocNumber
};
