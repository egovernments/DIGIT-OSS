import React from "react";
import { InfoBannerIcon } from "./svgindex";

const CitizenInfoLabel = ({ info, text, style, showInfo = true }) => {
  return (
    <div className="info-banner-wrap" style={style}>
      {showInfo && <div>
        <InfoBannerIcon />
        <h2>{info}</h2>
      </div>
      }
      <p>{text}</p>
    </div>
  );
};

export default CitizenInfoLabel;
