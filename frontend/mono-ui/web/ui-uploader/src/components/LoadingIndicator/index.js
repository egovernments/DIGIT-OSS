import React from "react";
import CircularProgress from "material-ui/CircularProgress";
import "./style.css";

const LoadingIndicator = () => {
  return <CircularProgress className="loading-indicator" />;
};

export default LoadingIndicator;
