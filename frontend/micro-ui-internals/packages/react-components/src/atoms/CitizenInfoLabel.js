import React from "react";
import { InfoBannerIcon } from "./svgindex";

const CitizenInfoLabel = ({ info, text, showInfo = true }) => {
  return (
    <div className="info-banner-wrap">
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
