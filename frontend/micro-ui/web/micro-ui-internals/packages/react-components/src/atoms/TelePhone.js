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
        {privacy && <a href={sessionStorage.getItem("unmaskedData") && sessionStorage.getItem("unmaskedData") !== "undefined" && !(sessionStorage.getItem("unmaskedData")?.includes("*")) && mobile.slice(-4) === sessionStorage.getItem("unmaskedData")?.slice(-4) ?`tel:${mobile}`:"javascript:void(0)"}><WrapUnMaskComponent value={`+91 ${mobile}`} iseyevisible={mobile?.includes("*")?true:false} privacy={privacy} style={{marginBottom:"-4px"}} storeunmask={true}></WrapUnMaskComponent></a>}
        {!privacy &&<a href={mobile.includes("*")?"javascript:void(0)":`tel:${mobile}`}>{"+91"} {mobile}</a>}
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
