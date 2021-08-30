import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import info from "assets/info.svg";
import "./index.css";

const defaultStyle = {
  backgroundColor: "transparent",
};

const PopperProps = {
  className: "tooltip-popper",
  fontSize: 48,
  style: {
    color: "#ffffff",
  },
};

const ToolTipUi = ({ placement, show, title, id }) => {
  return (
    <Tooltip id={id} title={title} placement={placement || "right"} PopperProps={PopperProps}>
      <Icon action="action" name="info" style={{ fontSize: 22 }} color="#ffffff">
        <img src={info} />
      </Icon>
    </Tooltip>
  );
};

ToolTipUi.propTypes = {
  title: PropTypes.string,
  placement: PropTypes.string,
};

export default ToolTipUi;
