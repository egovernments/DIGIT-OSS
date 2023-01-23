import {
  Calender, CardBasedOptions, CaseIcon, ComplaintIcon, DocumentIcon, HomeIcon, Loader, OBPSIcon, PTIcon, WhatsNewCard
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCitizenCurrentTenant(true);
  const { data: { stateInfo, uiHomePage } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
  let isMobile = window.Digit.Utils.browser.isMobile();

  const conditionsToDisableNotificationCountTrigger = () => {
    if (Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false;
    if (!Digit.UserService?.getUser()?.access_token) return false;
    return true;
  };

  const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({
    tenantId,
    variant: "whats-new",
    config: {
      enabled: conditionsToDisableNotificationCountTrigger(),
    },
  });

  if (!tenantId) {
    history.push(`/${window?.contextPath}/citizen/select-language`);
  }

  const appBannerWebObj = uiHomePage?.appBannerDesktop;
  const appBannerMobObj = uiHomePage?.appBannerMobile;
  const citizenServicesObj = uiHomePage?.citizenServicesCard;
  const infoAndUpdatesObj = uiHomePage?.informationAndUpdatesCard;
  const whatsAppBannerWebObj = uiHomePage?.whatsAppBannerDesktop;
  const whatsAppBannerMobObj = uiHomePage?.whatsAppBannerMobile;
  const whatsNewSectionObj = uiHomePage?.whatsNewSection;
  const redirectURL = uiHomePage?.redirectURL;
  /* configure redirect URL only if it is required to overide the default citizen home screen */
  if (redirectURL) {
    history.push(`/${window?.contextPath}/citizen/${redirectURL}`);
  }
  /* fix for sanitation ui */
  if (window?.location?.href?.includes?.("sanitation-ui")) {
    history.push(`/${window?.contextPath}/citizen/all-services`);
  }

  const handleClickOnWhatsAppBanner = (obj) => {
    window.open(obj?.navigationUrl);
  };

  const allCitizenServicesProps = {
    header: t(citizenServicesObj?.headerLabel),
    sideOption: {
      name: t(citizenServicesObj?.sideOption?.name),
      onClick: () => history.push(citizenServicesObj?.sideOption?.navigationUrl),
    },
    options: [
      {
        name: t(citizenServicesObj?.props?.[0]?.label),
        Icon: <ComplaintIcon />,
        onClick: () => history.push(citizenServicesObj?.props?.[0]?.navigationUrl),
      },
      {
        name: t(citizenServicesObj?.props?.[1]?.label),
        Icon: <PTIcon className="fill-path-primary-main" />,
        onClick: () => history.push(citizenServicesObj?.props?.[1]?.navigationUrl),
      },
      {
        name: t(citizenServicesObj?.props?.[2]?.label),
        Icon: <CaseIcon className="fill-path-primary-main" />,
        onClick: () => history.push(citizenServicesObj?.props?.[2]?.navigationUrl),
      },
      // {
      //     name: t("ACTION_TEST_WATER_AND_SEWERAGE"),
      //     Icon: <DropIcon/>,
      //     onClick: () => history.push(`/${window?.contextPath}/citizen`)
      // },
      {
        name: t(citizenServicesObj?.props?.[3]?.label),
        Icon: <OBPSIcon />,
        onClick: () => history.push(citizenServicesObj?.props?.[3]?.navigationUrl),
      },
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };
  const allInfoAndUpdatesProps = {
    header: t(infoAndUpdatesObj?.headerLabel),
    sideOption: {
      name: t(infoAndUpdatesObj?.sideOption?.name),
      onClick: () => history.push(infoAndUpdatesObj?.sideOption?.navigationUrl),
    },
    options: [
      {
        name: t(infoAndUpdatesObj?.props?.[0]?.label),
        Icon: <HomeIcon />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[0]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[1]?.label),
        Icon: <Calender />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[1]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[2]?.label),
        Icon: <DocumentIcon />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[2]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[3]?.label),
        Icon: <DocumentIcon />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[3]?.navigationUrl),
      },
      // {
      //     name: t("CS_COMMON_HELP"),
      //     Icon: <HelpIcon/>
      // }
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="HomePageContainer">
      {/* <div className="SideBarStatic">
        <StaticCitizenSideBar />
      </div> */}
      <div className="HomePageWrapper">
        {
          <div className="BannerWithSearch">
            {isMobile ? <img src={appBannerMobObj?.bannerUrl} /> : <img src={appBannerWebObj?.bannerUrl} />}
            {/* <div className="Search">
            <StandaloneSearchBar placeholder={t("CS_COMMON_SEARCH_PLACEHOLDER")} />
          </div> */}
            <div className="ServicesSection">
              <CardBasedOptions style={{ marginTop: "-30px" }} {...allCitizenServicesProps} />
              <CardBasedOptions style={isMobile ? {} : { marginTop: "-30px" }} {...allInfoAndUpdatesProps} />
            </div>
          </div>
        }

        {(whatsAppBannerMobObj || whatsAppBannerWebObj) && (
          <div className="WhatsAppBanner">
            {isMobile ? (
              <img src={whatsAppBannerMobObj?.bannerUrl} onClick={() => handleClickOnWhatsAppBanner(whatsAppBannerMobObj)} />
            ) : (
              <img src={whatsAppBannerWebObj?.bannerUrl} onClick={() => handleClickOnWhatsAppBanner(whatsAppBannerWebObj)} />
            )}
          </div>
        )}

        {conditionsToDisableNotificationCountTrigger() ? (
          EventsDataLoading ? (
            <Loader />
          ) : (
            <div className="WhatsNewSection">
              <div className="headSection">
                <h2>{t(whatsNewSectionObj?.headerLabel)}</h2>
                <p onClick={() => history.push(whatsNewSectionObj?.sideOption?.navigationUrl)}>{t(whatsNewSectionObj?.sideOption?.name)}</p>
              </div>
              <WhatsNewCard {...EventsData?.[0]} />
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Home;
