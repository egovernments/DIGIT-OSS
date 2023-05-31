import React from "react";
import { InfoBannerIcon } from "./svgindex";

const CitizenInfoLabel = (props) => {
  //if type is "component", then props will come from props?.props.
  //if the component has props passed directly, then props will be used.
  props = props?.props ? props?.props : props;
  const showInfo = props?.showInfo ? props?.showInfo : true;
  
  return (
    <div className={`info-banner-wrap ${props?.className ? props?.className : ""}`} style={props?.style}>
      {showInfo && <div>
        <InfoBannerIcon fill={props?.fill} />
        <h2 style={props?.textStyle}>{props?.info}</h2>
      </div>
      }
      <p style={props?.textStyle}>{props?.text}</p>
    </div>
  );
};

export default CitizenInfoLabel;
