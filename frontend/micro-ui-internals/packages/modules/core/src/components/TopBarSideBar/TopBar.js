import React from "react";
import { Dropdown, TopBar as TopBarComponent, Hamburger } from "@egovernments/digit-ui-react-components";
import ChangeLanguage from "../ChangeLanguage";

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
  
    const updateSidebar = () => {
      if (!Digit.clikOusideFired) {
        toggleSidebar(true);
      } else {
        Digit.clikOusideFired = false;
      }
    };
  
    if (CITIZEN) {
      return (
        <TopBarComponent
          img={stateInfo?.logoUrlWhite}
          isMobile={true}
          toggleSidebar={updateSidebar}
          logoUrl={stateInfo?.logoUrlWhite}
          onLogout={handleLogout}
          userDetails={userDetails}
        />
      );
    }
  
    return (
      <div className="topbar">
        {mobileView ? <Hamburger handleClick={toggleSidebar} color="#9E9E9E"/> : null}
        <img className="city" src={cityDetails?.logoId} />
        <p className="ulb" style={mobileView ? { fontSize: "14px", display: "inline-block" } : {}}>
          {t(cityDetails?.i18nKey).toUpperCase()}{" "}
          {t(`ULBGRADE_${cityDetails?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`).toUpperCase()}
        </p>
        {!mobileView && <div className={mobileView ? "right" : "flex-right right w-80 column-gap-15"}>
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