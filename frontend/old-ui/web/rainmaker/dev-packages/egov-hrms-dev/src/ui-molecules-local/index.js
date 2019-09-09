import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework//ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});

const Table = Loadable({
  loader: () => import("./Table"),
  loading: () => <Loading />
});

const Tooltip = Loadable({
  loader: () => import("./Tooltip"),
  loading: () => <Loading />
});

const UploadMultipleFiles = Loadable({
  loader: () => import("./UploadMultipleFiles"),
  loading: () => <Loading />
});

const UploadSingleFile = Loadable({
  loader: () => import("./UploadSingleFile"),
  loading: () => <Loading />
});

const SwitchWithLabel = Loadable({
  loader: () => import("./SwitchWithLabel"),
  loading: () => <Loading />
});

const DividerWithLabel = Loadable({
  loader: () => import("./DividerWithLabel"),
  loading: () => <Loading />
});

const ActionDialog = Loadable({
  loader: () => import("./ActionDialog"),
  loading: () => <Loading />
});

export {
  TestMolecules,
  Table,
  Tooltip,
  UploadMultipleFiles,
  UploadSingleFile,
  SwitchWithLabel,
  DividerWithLabel,
  ActionDialog
};
