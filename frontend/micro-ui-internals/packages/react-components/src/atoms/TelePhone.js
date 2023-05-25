import React from "react";
import PropTypes from "prop-types";
import { Phone } from "./svgindex";

const TelePhone = ({ mobile, text }) => (
  <React.Fragment>
    {text}
    <div className="telephone">
      <div className="call">
        <a href={`tel:${mobile}`}>{mobile}</a>
        <Phone />
      </div>
    </div>
  </React.Fragment>
);

TelePhone.propTypes = {
  mobile: PropTypes.any,
  text: PropTypes.string,
};

TelePhone.defaultProps = {
  mobile: "",
  text: "",
};

export default TelePhone;
