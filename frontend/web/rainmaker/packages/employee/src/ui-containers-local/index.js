import React from "react";
import Loadable from "react-loadable";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = () => <CircularProgress />;

const Iframe = Loadable({
  loader: () => import("./iframe"),
  loading: Loading,
});

export { Iframe };
