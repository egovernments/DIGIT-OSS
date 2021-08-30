import React from "react";
import Divider from "material-ui/Divider";
import PropTypes from "prop-types";

const DividerUi = ({ inset, lineStyle }) => {
  return <Divider inset={inset} style={lineStyle} />;
};

export default DividerUi;

DividerUi.propTypes = {
  inset: PropTypes.bool,
  style: PropTypes.object,
};
