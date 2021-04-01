import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import Icon from "@material-ui/core/Icon";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const defaultStyle = {
  backgroundColor: "transparent",
};

const PopperProps = {
  className: "tooltip-popper",
  fontSize: 48,
  style: {
    zIndex:4,
    color: "#ffffff",
  },
};

const ToolTipUi = ({ placement, show, title, id }) => {
  return (
    <Tooltip id={id} title={<Label label={title} color="#fff" fontSize="12px" />} placement={placement || "right"} PopperProps={PopperProps}>
      <Icon color="disabled" style={{ fontSize: 24 }}>
        <InfoIcon />
      </Icon>
    </Tooltip>
  );
};

ToolTipUi.propTypes = {
  title: PropTypes.string,
  placement: PropTypes.string,
};

export default ToolTipUi;
