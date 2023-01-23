import React from "react";
import { InfoBannerIcon } from "./svgindex";

const CitizenInfoLabel = ({ info, text, style, textStyle, showInfo = true, className,fill }) => {
  return (
    <div className={`info-banner-wrap ${className ? className : ""}`} style={style}>
      {showInfo && <div>
        <InfoBannerIcon fill={fill} />
        <h2 style={textStyle}>{info}</h2>
      </div>
      }
      <p style={textStyle}>{text}</p>
    </div>
  );
};

export default CitizenInfoLabel;
