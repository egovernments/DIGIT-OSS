import React from "react";
import PropTypes from "prop-types";
import RefreshIndicator from "material-ui/RefreshIndicator";

const style = {
  container: {
    height: "100%",
    width: "100%",
    position: "fixed",
    backgroundColor: "rgba(189,189,189,0.5)",
    zIndex: 9998,
    left: 0,
    top: 0,
  },
  containerHide: {
    display: "none",
    position: "relative",
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
    color: "#FF9800",
  },
};

const LoadingIndicator = ({ status = "loading", loadingColor, size = 40, left = 10, top = 40 }) => {
  return (
    <div id="loading-indicator" style={status === "hide" ? style.containerHide : style.container}>
      <RefreshIndicator size={size} left={left} top={top} status={status} style={style.refresh} />
    </div>
  );
};

LoadingIndicator.propTypes = {
  size: PropTypes.number,
  left: PropTypes.number,
  top: PropTypes.number,
  status: PropTypes.string,
  loadingColor: PropTypes.string,
  style: PropTypes.object,
};

export default LoadingIndicator;
