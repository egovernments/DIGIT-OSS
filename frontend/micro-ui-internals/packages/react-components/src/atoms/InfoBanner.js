import React from "react";
import { ErrorSvg, InfoBannerIcon } from "./svgindex";

const InfoBanner = ({ label, text }) => {
  return (
    <div className="info-banner-wrap">
      <div>
        <InfoBannerIcon />
        <h2>{label}</h2>
      </div>
      <p>{text}</p>
    </div>
  );
};

export default InfoBanner;
