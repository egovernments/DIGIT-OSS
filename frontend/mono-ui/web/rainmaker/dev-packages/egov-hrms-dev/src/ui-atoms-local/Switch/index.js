import React from "react";
import Switch from "@material-ui/core/Switch";

const MUISwitch = props => {
  const { checked, value, ...rest } = props;
  return <Switch checked={checked} value={value} {...rest} />;
};

export default MUISwitch;
