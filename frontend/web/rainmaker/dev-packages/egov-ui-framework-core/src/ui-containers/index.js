import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "../ui-atoms/LinearSpinner";
const Loading = () => <LinearProgress />;

const LabelContainer = Loadable({
  loader: () => import("./LabelContainer"),
  loading: () => <Loading />
});

const TextFieldContainer = Loadable({
  loader: () => import("./TextFieldContainer"),
  loading: () => <Loading />
});

const MultiItem = Loadable({
  loader: () => import("./MultiItem"),
  loading: () => <Loading />
});

const SnackbarContainer = Loadable({
  loader: () => import("./SnackbarContainer"),
  loading: () => <Loading />
});

const CustomTabContainer = Loadable({
  loader: () => import("./CustomTabContainer"),
  loading: () => <Loading />
});

const DownloadFileContainer = Loadable({
  loader: () => import("./DownloadFileContainer"),
  loading: () => <Loading />
});

const RadioGroupContainer = Loadable({
  loader: () => import("./RadioGroupContainer"),
  loading: () => <Loading />
});

const AutosuggestContainer = Loadable({
  loader: () => import("./AutosuggestContainer"),
  loading: () => <Loading />
});

const DialogContainer = Loadable({
  loader: () => import("./DialogContainer"),
  loading: () => <Loading />
});

const DynamicMdmsContainer = Loadable({
  loader: () => import("./DynamicMdmsContainer"),
  loading: () => <Loading />
});

const AcknowledgementContainer = Loadable({
  loader: () => import("./AcknowledgementContainer"),
  loading: () => <Loading />
});

const ModifyLabelConatiner = Loadable({
  loader: () => import("./ModifyLabelConatiner"),
  loading: () => <Loading />
});

export {
  TextFieldContainer,
  RadioGroupContainer,
  LabelContainer,
  MultiItem,
  SnackbarContainer,
  CustomTabContainer,
  DownloadFileContainer,
  AutosuggestContainer,
  DialogContainer,
  DynamicMdmsContainer,
  AcknowledgementContainer,
  ModifyLabelConatiner
};
