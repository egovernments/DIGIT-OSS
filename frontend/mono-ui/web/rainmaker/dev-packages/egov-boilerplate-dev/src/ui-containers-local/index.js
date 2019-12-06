import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;


const TestContainer = Loadable({
  loader: () => import("./TestContainer"),
  loading: () => <Loading />
});

export {
  TestContainer
};
