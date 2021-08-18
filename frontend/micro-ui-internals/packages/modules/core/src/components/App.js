import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Redirect, Route, Switch, useHistory } from "react-router-dom";
import { TopBar as TopBarComponent, Dropdown, LogoutIcon, HomeIcon, Hamburger } from "@egovernments/digit-ui-react-components";
import ChangeLanguage from "./ChangeLanguage";
import { useSelector } from "react-redux";

import { AppModules } from "./AppModules";
import { CitizenSidebar } from "./Sidebar";
import { useLocation } from "react-router-dom";

const TextToImg = (props) => (
  <span className="user-img-txt" onClick={props.toggleMenu} title={props.name}>
    {props.name[0].toUpperCase()}
  </span>
);
const capitalize = (text) => text.substr(0, 1).toUpperCase() + text.substr(1);
const ulbCamel = (ulb) => ulb.toLowerCase().split(" ").map(capitalize).join(" ");

export const DigitApp = ({ stateCode, modules, appTenants, logoUrl }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const classname = Digit.Hooks.fsm.useRouteSubscription(pathname);

  const [displayMenu, toggleMenu] = useState(false);
  const innerWidth = window.innerWidth;
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const userDetails = Digit.UserService.getUser();
  const { stateInfo } = useSelector((state) => state.common);
  const CITIZEN = userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);

  history.listen(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });

  const handleUserDropdownSelection = (option) => {
    option.func();
  };

  const mobileView = innerWidth <= 640;

  const sideBarOpenStyles = { width: "100%", position: "fixed" };

  return (
    <Switch>
      <Route path="/digit-ui/employee">
        <div className="employee">
          <TopBarSideBar
            t={t}
            stateInfo={stateInfo}
            userDetails={userDetails}
            CITIZEN={CITIZEN}
            cityDetails={cityDetails}
            mobileView={mobileView}
            handleUserDropdownSelection={handleUserDropdownSelection}
            logoUrl={logoUrl}
          />
          <div className={`main ${DSO ? "m-auto" : ""}`}>
            <AppModules stateCode={stateCode} userType="employee" modules={modules} appTenants={appTenants} />
          </div>
        </div>
      </Route>
      <Route path="/digit-ui/citizen">
        <div className={classname}>
          <TopBarSideBar
            t={t}
            stateInfo={stateInfo}
            userDetails={userDetails}
            CITIZEN={CITIZEN}
            cityDetails={cityDetails}
            mobileView={mobileView}
            handleUserDropdownSelection={handleUserDropdownSelection}
            logoUrl={logoUrl}
          />
          <div className={`main center-container`}>
            <AppModules stateCode={stateCode} userType="citizen" modules={modules} appTenants={appTenants} />
          </div>
        </div>
      </Route>
      <Route>
        <Redirect to="/digit-ui/citizen" />
      </Route>
    </Switch>
  );
};

function TopBarSideBar(props) {
  const { t, stateInfo, userDetails, CITIZEN, cityDetails, mobileView, handleUserDropdownSelection, logoUrl } = props;
  const [isSidebarOpen, toggleSidebar] = useState(false);

  const handleLogout = () => {
    toggleSidebar(false);
    Digit.UserService.logout();
  };

  const userOptions = [{ name: t("CORE_COMMON_LOGOUT"), icon: <LogoutIcon className="icon" />, func: handleLogout }];

  return (
    <React.Fragment>
      <TopBar
        t={t}
        stateInfo={stateInfo}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        handleLogout={handleLogout}
        userDetails={userDetails}
        CITIZEN={CITIZEN}
        cityDetails={cityDetails}
        mobileView={mobileView}
        userOptions={userOptions}
        handleUserDropdownSelection={handleUserDropdownSelection}
        logoUrl={logoUrl}
      />
      <SideBar
        t={t}
        CITIZEN={CITIZEN}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        mobileView={mobileView}
        userDetails={userDetails}
      />
    </React.Fragment>
  );
}

function TopBar(props) {
  const {
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
  } = props;

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
      <img className="city" src={cityDetails?.logoId} />
      <span className="ulb" style={mobileView ? { fontSize: "14px" } : {}}>
        {t(cityDetails?.i18nKey).toUpperCase()}{" "}
        {t(`ULBGRADE_${cityDetails?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`).toUpperCase()}
      </span>
      <div className={mobileView ? "right" : "flex-right right w-80 column-gap-15"}>
        {!mobileView && (
          <div className="left">
            <ChangeLanguage dropdown={true} />
          </div>
        )}
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
        {!mobileView && <img className="state" src={logoUrl} />}
      </div>
    </div>
  );
}

function SideBar(props) {
  const { t, CITIZEN, isSidebarOpen, toggleSidebar, handleLogout, mobileView, userDetails } = props;
  if (CITIZEN) {
    return <CitizenSidebar isOpen={isSidebarOpen} isMobile={true} toggleSidebar={toggleSidebar} onLogout={handleLogout} />;
  }
  return (
    <React.Fragment>
      {!mobileView && userDetails?.access_token && (
        <div className="sidebar">
          <Link to="/digit-ui/employee">
            <div className="actions active">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="white" />
              </svg>
            </div>
          </Link>
          <a href="/employee">
            <div className="actions">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M8.17 5.7L1 10.48V21h5v-8h4v8h5V10.25z" fill="white" />
                <path d="M17 7h2v2h-2z" fill="none" />
                <path d="M10 3v1.51l2 1.33L13.73 7H15v.85l2 1.34V11h2v2h-2v2h2v2h-2v4h6V3H10zm9 6h-2V7h2v2z" fill="white" />
              </svg>
            </div>
          </a>
          <a href="/employee">
            <div className="actions">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
                  fill="white"
                />
              </svg>
            </div>
          </a>
          <a href="/employee">
            <div className="actions">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M24 0H0v24h24z" fill="none" />
                <path
                  d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"
                  fill="white"
                />
              </svg>
            </div>
          </a>
        </div>
      )}
    </React.Fragment>
  );
}
