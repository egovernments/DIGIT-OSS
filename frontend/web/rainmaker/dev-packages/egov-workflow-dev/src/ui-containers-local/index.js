import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const TaskStatusContainer = Loadable({
  loader: () => import("./TaskStatusContainer"),
  loading: () => <Loading />
});

const WorkFlowContainer = Loadable({
  loader: () => import("./WorkFlowContainer"),
  loading: () => <Loading />
});

export { TaskStatusContainer, WorkFlowContainer };
