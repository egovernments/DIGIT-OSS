import React from "react";
import PropTypes from "prop-types";
import "./index.css";

const CardUi = ({ id, card, style = {}, textChildren, className = "", onClick }) => {
  return (
    <div style={style} id={id} className={`rainmaker-card clearfix ${className}`} onClick={onClick}>
      {textChildren}
    </div>
  );
};

export default CardUi;

CardUi.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  textChildren: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};
