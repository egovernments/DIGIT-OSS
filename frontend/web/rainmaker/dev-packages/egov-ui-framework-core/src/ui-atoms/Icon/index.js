import React from "react";
import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";

const MihyIcon = props => {
  const { iconName, color, iconSize, size = "24px", ...rest } = props;
  return (
    <Icon color={color} style={{ fontSize: size }} {...rest}>
      <i class="material-icons" style={{ fontSize: iconSize }}>
        {iconName}
      </i>
    </Icon>
  );
};

MihyIcon.propTypes = {
  iconName: PropTypes.string
};

export default MihyIcon;
