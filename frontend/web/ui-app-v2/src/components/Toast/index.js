import React from "react";
import PropTypes from "prop-types";
import Snackbar from "material-ui/Snackbar";

const Toast = ({ open = false, autoHideDuration = 4000, error = true, message }) => {
  return (
    <Snackbar
      open={open}
      id="toast-message"
      message={message}
      autoHideDuration={autoHideDuration}
      style={{ pointerEvents: "none", width: "95%", whiteSpace: "nowrap" }}
      bodyStyle={{
        pointerEvents: "initial",
        maxWidth: "none",
        lineHeight: "20px",
        height: "auto",
        maxHeight: "60px",
        padding: "5px",
        whiteSpace: "pre-line",
        textAlign: "center",
      }}
    />
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  open: PropTypes.bool,
  error: PropTypes.bool,
  autoHideDuration: PropTypes.number,
};

export default Toast;
