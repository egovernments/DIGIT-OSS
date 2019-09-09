import React from "react";
import Dialog from "material-ui/Dialog";
import PropTypes from "prop-types";
import Icon from "../Icon";
import "./index.css";

const defaultOverlayStyle = {};
const defaultTitleStyle = {
  textAlign: "center",
  background: "#fff",
  color: "#484848",
  fontSize: "16px",
};
const defaultActionsContainerStyle = {
  padding: "14px",
};
const defaultContentStyle = {
  width: "75%",
};

const defaultBodyStyle = {
  padding: "0 12px",
};

const closebuttonStyle = {
  width: "25px",
  height: "25px",
  padding: "3px",
};

const DialogUI = ({
  title,
  modal,
  titleStyle,
  overlayStyle,
  actionsContainerStyle = {},
  bodyStyle = {},
  children,
  className,
  actions,
  contentStyle,
  open,
  repositionOnUpdate = false,
  autoScrollBodyContent,
  handleClose,
  contentClassName,
  style,
  isClose,
  onRequestClose,
}) => {
  return (
    <Dialog
      className={className}
      title={title}
      contentClassName={contentClassName}
      actions={actions}
      titleStyle={{ ...defaultTitleStyle, ...titleStyle }}
      children={[
        isClose && (
          <div className="dialog-close-button" key={"dialog-close-button"}>
            <Icon action="navigation" name="close" color="#484848" style={closebuttonStyle} onClick={handleClose} />
          </div>
        ),
        ...children,
      ]}
      autoScrollBodyContent={autoScrollBodyContent}
      overlayStyle={{ ...defaultOverlayStyle, ...overlayStyle }}
      actionsContainerStyle={{ ...defaultActionsContainerStyle, ...actionsContainerStyle }}
      contentStyle={{ ...defaultContentStyle, ...contentStyle }}
      bodyStyle={{ ...defaultBodyStyle, ...bodyStyle }}
      open={open}
      autoDetectWindowHeight={false}
      style={{
        paddingTop: "0 !important",
        ...style,
      }}
      repositionOnUpdate={repositionOnUpdate}
      modal={modal}
      onRequestClose={onRequestClose}
    />
  );
};

DialogUI.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.string,
  handleClose: PropTypes.func,
  overlayStyle: PropTypes.object,
  actionsContainerStyle: PropTypes.object,
  autoScrollBodyContent: PropTypes.bool,
  titleStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  open: PropTypes.bool.isRequired,
};

export default DialogUI;
