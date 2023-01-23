import React from "react";
import PropTypes from "prop-types";
import { Phone } from "./svgindex";

const TelePhone = ({ mobile, text }) => (
  <React.Fragment>
    {text}
    <div className="telephone">
      <div className="call">
        <Phone fillcolor={"FFFFFF"} style={{marginLeft:"0px"}} />
        <a href={`tel:${mobile}`}>{"+91"} {mobile}</a>
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
