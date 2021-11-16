import React from "react";
import { Dropdown, TopBar as TopBarComponent, Hamburger } from "@egovernments/digit-ui-react-components";
import ChangeLanguage from "../ChangeLanguage";
import { useHistory, useLocation  } from "react-router-dom"

const TextToImg = (props) => (
  <span className="user-img-txt" onClick={props.toggleMenu} title={props.name}>
    {props.name[0].toUpperCase()}
  </span>
);

const TopBar = ({
    t,
    stateInfo,
    toggleSidebar,
    isSidebarOpen,
    handleLogout,
    userDetails,
    CITIZEN,
    cityDetails,
    mobileView,
    userOptions,
    handleUserDropdownSelection,
    logoUrl,
  } ) => {
    
    const CitizenHomePageTenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code

    let history = useHistory();
    const { pathname } = useLocation();
    
    const conditionsToDisableNotificationCountTrigger = () => {
      if(Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false
      if(!Digit.UserService?.getUser()?.access_token) return false
      return true
    }

    const { data:{ unreadCount: unreadNotificationCount } = {}, isSuccess: notificationCountLoaded } = Digit.Hooks.useNotificationCount({tenantId:CitizenHomePageTenantId, config:{
      enabled: conditionsToDisableNotificationCountTrigger()
    }})
  
    const updateSidebar = () => {
      if (!Digit.clikOusideFired) {
        toggleSidebar(true);
      } else {
        Digit.clikOusideFired = false;
      }
    };

    function onNotificationIconClick(){
      history.push("/digit-ui/citizen/engagement/notifications")
    }

    const urlsToDisableNotificationIcon = (pathname) => !!Digit.UserService?.getUser()?.access_token ? false :  ["/digit-ui/citizen/select-language", "/digit-ui/citizen/select-location"].includes(pathname)
    

    if (CITIZEN) {
      return (
        <TopBarComponent
          img={stateInfo?.logoUrlWhite}
          isMobile={true}
          toggleSidebar={updateSidebar}
          logoUrl={stateInfo?.logoUrlWhite}
          onLogout={handleLogout}
          userDetails={userDetails}
          notificationCount={unreadNotificationCount < 99 ? unreadNotificationCount : 99}
          notificationCountLoaded={notificationCountLoaded}
          cityOfCitizenShownBesideLogo={t(CitizenHomePageTenantId)}
          onNotificationIconClick={onNotificationIconClick}
          hideNotificationIconOnSomeUrlsWhenNotLoggedIn={urlsToDisableNotificationIcon(pathname)}
        />
      );
    }
  const loggedin=userDetails?.access_token?true:false;
    return (
      <div className="topbar">
        {mobileView ? <Hamburger handleClick={toggleSidebar} color="#9E9E9E"/> : null}
        <img className="city" src={loggedin?cityDetails?.logoId:stateInfo?.statelogo} />
        {
          loggedin&&(cityDetails?.city?.ulbGrade ? <p className="ulb" style={mobileView ? { fontSize: "14px", display: "inline-block" } : {}}>
          {t(cityDetails?.i18nKey).toUpperCase()}{" "}
          {t(`ULBGRADE_${cityDetails?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`).toUpperCase()}
        </p>
        : <img className="state" src={logoUrl} />)
        }
        {!loggedin&&(<p className="ulb" style={mobileView ? { fontSize: "14px", display: "inline-block" } : {}}>
        {t(`MYCITY_${stateInfo?.code?.toUpperCase()}_LABEL`)}{" "}
        {t(`MYCITY_STATECODE_LABEL`)}
      </p>)}
        {!mobileView && <div className={mobileView ? "right" : "flex-right right w-80 column-gap-15"} style={!loggedin?{width:'80%'}:{}}>
          <div className="left">
            <ChangeLanguage dropdown={true} />
          </div>
          {userDetails?.access_token && (
            <div className="left">
              <Dropdown
                option={userOptions}
                optionKey={"name"}
                select={handleUserDropdownSelection}
                showArrow={false}
                freeze={true}
                style={mobileView ? { right: 0 } : {}}
                optionCardStyles={{ overflow: "revert" }}
                customSelector={<TextToImg name={userDetails?.info?.name || userDetails?.info?.userInfo?.name || "Employee"} />}
              />
            </div>
          )}
          <img className="state" src={logoUrl} />
        </div>}
      </div>
    );
  }

  export default TopBar