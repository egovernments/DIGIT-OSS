import { Header, CloseSvg, DownloadImgIcon, CustomButton, Loader, BackButton, PDFSvg, DownloadBtnCommon} from "@egovernments/digit-ui-react-components";
import React, { useState, Fragment }from "react";
import { useTranslation } from "react-i18next";


const HowItWorks = ({module}) => {
  const isMobile = window.Digit.Utils.browser.isMobile();
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

  const ViDSvg = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C5.38053 24 0 18.6143 0 12C0 5.38054 5.38053 1.90735e-06 12 1.90735e-06C18.6143 1.90735e-06 24 5.38054 24 12C24 18.6143 18.6143 24 12 24ZM16.3488 10.7852L11.3855 7.25251C11.1263 7.0701 10.8238 6.97889 10.5214 6.97889C10.291 6.97889 10.0557 7.03172 9.83976 7.14202C9.34054 7.40118 9.02857 7.91006 9.02857 8.46694L9.02877 15.5323C9.02877 16.0892 9.34076 16.5979 9.83996 16.8572C10.3344 17.1116 10.9296 17.0732 11.3857 16.7467L16.349 13.214C16.7426 12.9356 16.9778 12.4795 16.9778 11.9996C16.9776 11.5197 16.7426 11.0636 16.3489 10.7852L16.3488 10.7852Z" fill="white"/>
    </svg>
  );

  function CloseVidSvg({onClick}){
    return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
    <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="white"/>
    </svg>
    );
  }
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
    <div className="how-it-works-page">
      <div style={{marginLeft: "-10px"}}><BackButton /></div>
        <div className="how-it-works-page-header">
          <div style={{marginLeft:isMobile ? "-15px":""}}><Header>{t("HOW_IT_WORKS")}</Header></div>
        </div>
        <div className="language-selector" style={{marginBottom: "10px"}}>
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
            <div className="video-icon" onClick={() => onClickVideo(videos)}>
                <div className="vid-svg">
                  <ViDSvg></ViDSvg>
                </div>
            </div>
              <div className="how-it-works-header-description">
                <h2>{t(videos.headerLabel)}</h2>
                <p>{t(videos.description)}</p>
              </div>
            </div>
        </div>

    ))}
    <div className="WhatsNewCard" style={{ position: "relative", width: "100%", marginBottom: 10, display: "inline-block"}}>
      <div className="how-it-works-pdf-section">
        <div className="pdf-icon-header-desc">
        <div className="pdf-icon">
           <PDFSvg></PDFSvg>
        </div>
        <div className="pdf-header-desc">
                <h2>{t(mdmsConfigResult.pdfHeader)}</h2>
                <p>{t(mdmsConfigResult.pdfDesc)}</p>
          </div>
        </div>
        <div className="download-icon">
            <DownloadImgIcon/>
        </div>
      </div>
        </div>
        { videoPlay && (
                <div className="how-it-works-video-play">
                  <div className="close-button" style={{position:"absolute", right:"15px",top:"10%", zIndex:"1"}}>
                        <CloseVidSvg onClick={onClose}></CloseVidSvg>
                        </div>
                    <video width={500}  height={500} controls autoPlay muted style={{position:"fixed", top:"0",left:"0",minWidth:"100%",minHeight:"100%", backgroundColor: "rgba(0,0,0,0.5)"}}>
                        <source src={vidSrc} type="video/mp4"></source>
                    </video>
                </div>
            )}
    </div>
    </Fragment>
  );
};

export default HowItWorks;