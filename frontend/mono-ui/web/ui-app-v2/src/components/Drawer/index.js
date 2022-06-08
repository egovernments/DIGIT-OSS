import React from "react";
import Drawer from "material-ui/Drawer";
import PropTypes from "prop-types";

const DrawerUi = (props) => {
  return <Drawer {...props}>{props.children}</Drawer>;
};

export default DrawerUi;

DrawerUi.propTypes = {
  props: PropTypes.object,
};
