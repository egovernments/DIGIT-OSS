import React from "react";
import PropTypes from "prop-types";
import { Phone } from "./svgindex";
import { WrapUnMaskComponent } from "..";

const TelePhone = ({ mobile, text, privacy }) => (
  <React.Fragment>
    {text}
    <div className="telephone">
      <div className="call">
        <Phone fillcolor={"FFFFFF"} style={{marginLeft:"0px"}} />
        {privacy && <a href={`tel:${mobile}`}><WrapUnMaskComponent value={`+91 ${mobile}`} iseyevisible={mobile?.includes("*")?true:false} privacy={privacy}></WrapUnMaskComponent></a>}
        {!privacy &&<a href={`tel:${mobile}`}>{"+91"} {mobile}</a>}
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
