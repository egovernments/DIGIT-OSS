import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});


const FeeEstimateCard =Loadable({
  loader: () => import("./FeeEstimateCard"),
  loading: () => <Loading />
});
const DemandRevisionDetailsCard =Loadable({
  loader: () => import("./DemandRevisionDetailsCard"),
  loading: () => <Loading />
});
const DividerWithLabel =Loadable({
  loader: () => import("./DividerWithLabel"),
  loading: () => <Loading />
});
const DocumentList = Loadable({
  loader: () => import("./DocumentList"),
  loading: () => <Loading />
});

const UploadSingleFile = Loadable({
  loader: () => import("./UploadSingleFile"),
  loading: () => <Loading />
});

export {
  TestMolecules,
  FeeEstimateCard,
  DemandRevisionDetailsCard,
  DividerWithLabel,
  DocumentList,
  UploadSingleFile
};
