import { Header, CloseSvg, DownloadImgIcon} from "@egovernments/digit-ui-react-components";
import React, { useState, Fragment }from "react";
import { useTranslation } from "react-i18next";
import VideoImg from "../HowItWorks/VideoImg.svg";
import PdfImg from "../HowItWorks/pdf.svg";
const PTHowItWorks = () => {
  const { t } = useTranslation();
  const [videoPlay, setVideoPlay] = useState(false);
  const mdmsResult = {
    videosJson:  [
    {
        headerLabel: "Adding a Property",
        description: "Pay your property tax dues before due date and get 10% rebate"
    },
    {
        headerLabel: "Property Bifurcation",
        description: "Pay your property tax dues before due date and get 10% rebate"
    },
    {
        headerLabel: "Modifying Property Details",
        description: "Pay your property tax dues before due date and get 10% rebate"
    }
],
    pdfHeader: "CITIZEN_CHARTER_DOCUMENT",
    pdfDesc: "New Municipal document has been released in July 2021 and will be effect from October 2021"
  }

  const onClickVideo = () => {
      console.log("Video Starts");
      setVideoPlay(true);
  }
  const onClose = () => {
      setVideoPlay(false);
  }
  return (
    <Fragment>
    <div>
        <div style={{ marginBottom: "15px" }}>
          <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px"}}>{t("HOW_IT_WORKS")}</Header>
        </div>
        {mdmsResult.videosJson.map((videos, index) => (
        <div >
            <div className="WhatsNewCard" style={{float: "left", position: "relative", width: "100%", marginBottom: 10}}>
            <div style={{float: "left", backgroundColor: "#6F6F6F", height: "40px", width: "40px", cursor: "pointer"}}>
                <img src={VideoImg} alt="Video" onClick={onClickVideo} ></img>
            </div>
                <h2>{t(videos.headerLabel)}</h2>
                <p>{videos.description}</p>
            </div>
        </div>
        
    ))}
    <div className="WhatsNewCard" style={{ position: "relative", width: "100%", marginBottom: 10, display: "inline-block"}}>
            <div style={{float: "left", height: "40px", width: "40px"}}>
                <img src={PdfImg} alt="Pdf"></img>
            </div>
            <div>
                <h2>{t(mdmsResult.pdfHeader)}</h2>
                <p>{mdmsResult.pdfDesc}</p>
            </div>
            <div style={{float: "right"}}>
                <DownloadImgIcon></DownloadImgIcon>
            </div>
        </div>
        { videoPlay && (
                <div style={{display: "inline-block"}}>
                    <div style={{float: "right", cursor: "pointer"}}>
                    <CloseSvg onClick={onClose}></CloseSvg>
                    </div>
                    <video width={500}  height={500} controls autoPlay>
                        <source src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4"></source>
                    </video>
                </div>
            )}
    </div>
    </Fragment>
  );
};

export default PTHowItWorks;
