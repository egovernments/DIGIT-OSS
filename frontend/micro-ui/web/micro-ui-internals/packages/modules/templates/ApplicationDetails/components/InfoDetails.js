import React from "react";
import { InfoBannerIcon } from "@egovernments/digit-ui-react-components";

const EyeSvgINdex = ({ style }) => {
  return <span>
    <svg style={{ ...style }} display="inline" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z" fill="#F47738" />
    </svg>
  </span>

}
const InfoDetails = ({ t, userType = false, infoBannerLabel = "", infoClickLable = "", infoClickInfoLabel = "", infoClickInfoLabel1 = "" }) => {
  userType = userType || Digit.SessionStorage.get("userType");
  return (
    <React.Fragment>
      <div style={{ width: "80%" }}>
        <div className="info-banner-wrap" style={{ color: "#3498DB", margin: "0px" }}>
          <div>
            <InfoBannerIcon />
            <h2 style={{ color: "#3498DB" }}>{t(infoBannerLabel)}</h2>
          </div>
          {`${t(infoClickLable)} `}
          <EyeSvgINdex style={{ display: "inline", marginBottom: "5px" }} />
          {` ${t(infoClickInfoLabel)}`}
          <div>
            {` ${t(infoClickInfoLabel1)}`}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default InfoDetails;