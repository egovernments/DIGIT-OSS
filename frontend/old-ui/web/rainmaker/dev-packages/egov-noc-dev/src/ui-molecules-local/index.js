import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});

const MultiDocDetailCard = Loadable({
  loader: () => import("./MultiDocDetailCard"),
  loading: () => <Loading />
 });

 const UploadCard = Loadable({
  loader: () => import("./UploadCard"),
  loading: () => <Loading />
 });

 const UploadMultipleFile = Loadable({
  loader: () => import("./UploadMultipleFile"),
  loading: () => <Loading />
});

export {
  TestMolecules,
  MultiDocDetailCard,
  UploadCard,
  UploadMultipleFile
};
