import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const TestContainer = Loadable({
  loader: () => import("./TestContainer"),
  loading: () => <Loading />
});

const PreviewContainer = Loadable({
  loader: () => import("./PreviewContainer"),
  loading: () => <Loading />
});

export {
  TestContainer,
  PreviewContainer
};
