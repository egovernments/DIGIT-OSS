import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";

const style = {
  container: {
    height: "100%",
    width: "100%",
    position: "fixed",
    backgroundColor: "rgba(189,189,189,0.5)",
    zIndex: 9998,
    left: 0,
    top: 0
  },
  containerHide: {
    display: "none",
    position: "relative"
  },
  refresh: {
    display: "block",
    position: "absolute",
    zIndex: 9999,
    margin: "auto",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    transform: "none",
    color: "#FE7A51"
  }
};

const LoadingIndicator = ({ status = "loading", loadingColor }) => {
  return (
    <div
      id="loading-indicator"
      style={status === "hide" ? style.containerHide : style.container}
    >
      <CircularProgress style={style.refresh} size={50} />
    </div>
  );
};

LoadingIndicator.propTypes = {
  status: PropTypes.string,
  loadingColor: PropTypes.string,
  style: PropTypes.object
};

export default LoadingIndicator;
