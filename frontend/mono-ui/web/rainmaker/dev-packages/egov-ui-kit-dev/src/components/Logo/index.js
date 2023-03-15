import React from "react";
import Image from "../Image";
import logoMseva from "egov-ui-kit/assets/images/Mseva logo.png";
import "./index.css";

const imageStyle = {
  height: "auto",
  width: "76px",
};

const spanStyle = {
  fontSize: "16px",
  width: "54px",
};

const Logo = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="mseva-image-container">
        <Image className="mseva-logo-style" source={`${logoMseva}`} style={imageStyle} />
      </div>
      <div className="mseva-text-container">
        <span style={spanStyle}> Punjab</span>
      </div>
    </div>
  );
};

export default Logo;
