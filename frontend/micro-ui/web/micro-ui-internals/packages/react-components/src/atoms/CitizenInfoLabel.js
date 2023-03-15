import React from "react";
import { InfoBannerIcon } from "./svgindex";

const CitizenInfoLabel = ({ info, text, style, textStyle, showInfo = true, className }) => {
  return (
    <div className={`info-banner-wrap ${className ? className : ""}`} style={style}>
      {showInfo && <div>
        <InfoBannerIcon />
        <h2>{info}</h2>
      </div>
      }
      <p style={textStyle}>{text}</p>
    </div>
  );
};

export default CitizenInfoLabel;
