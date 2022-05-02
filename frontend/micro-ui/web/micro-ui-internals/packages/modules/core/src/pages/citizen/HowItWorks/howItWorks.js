import { Header, CloseSvg, DownloadImgIcon, CustomButton, Loader} from "@egovernments/digit-ui-react-components";
import React, { useState, Fragment }from "react";
import { useTranslation } from "react-i18next";
import VideoImg from "./images/VideoImg.svg"
import PdfImg from "./images/pdfImg.svg";

const HowItWorks = ({module}) => {
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.tenantId || Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const storeData = Digit.SessionStorage.get("initData");
  const stateInfo = storeData.stateInfo;
  const selectedLanguage = Digit.StoreData.getCurrentLanguage();
  const [selected, setselected] = useState(selectedLanguage);
  const handleChangeLanguage = (language) => {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };
  const [videoPlay, setVideoPlay] = useState(false);
  const [vidSrc, setVidSrc] = useState("");

  const onClickVideo = (vidObj) => {
    if(selected === "hi_IN"){
      setVidSrc(vidObj["hi_IN"]);
    }
    else{
      setVidSrc(vidObj["en_IN"]);
    }
    setVideoPlay(true);
  }
  const onClose = () => {
      setVideoPlay(false);
  }

  const { isLoading, data } = Digit.Hooks.useGetHowItWorksJSON(Digit.ULBService.getStateId());


  const mdmsConfigResult = data?.MdmsRes["common-masters"]?.howItWorks[0]?.[`${module}`];
  const languages = 
  [
    {
      label: "ENGLISH",
      value: "en_IN"
    },
    {
      label: "हिंदी",
      value: "hi_IN"
    }
  ];

  if(isLoading){
    return <Loader/>
  }
  return (
    <Fragment>
    <div style={{width: "100%"}}>
        <div style={{ marginBottom: "15px" }}>
          <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px"}}>{t("HOW_IT_WORKS")}</Header>
        </div>
        <div className="language-selector" style={{margin: "10px"}}>
          {languages.map((language, index) => (
            <div className="language-button-container" key={index}>
              <CustomButton
                selected={language.value === selected}
                text={language.label}
                onClick={() => handleChangeLanguage(language)}
              ></CustomButton>
            </div>
          ))}
        </div>
        {mdmsConfigResult.videosJson.map((videos, index) => (
        <div >
            <div className="WhatsNewCard" style={{float: "left", position: "relative", width: "100%", marginBottom: 10}}>
            <div style={{float: "left", backgroundColor: "#6F6F6F", height: "40px", width: "40px", cursor: "pointer"}}>
                <img src={VideoImg} alt="Video" onClick={() => onClickVideo(videos)} ></img>
            </div>
                <h2>{t(videos.headerLabel)}</h2>
                <p>{t(videos.description)}</p>
            </div>
        </div>

    ))}
    <div className="WhatsNewCard" style={{ position: "relative", width: "100%", marginBottom: 10, display: "inline-block"}}>
            <div style={{float: "left", height: "40px", width: "40px"}}>
                <img src={PdfImg} alt="Pdf"></img>
            </div>
            <div>
                <h2>{t(mdmsConfigResult.pdfHeader)}</h2>
                <p>{mdmsConfigResult.pdfDesc}</p>
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
                        <source src={vidSrc} type="video/mp4"></source>
                    </video>
                </div>
            )}
    </div>
    </Fragment>
  );
};

export default HowItWorks;