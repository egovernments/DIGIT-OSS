import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { AppModules } from "../../components/AppModules";
import TopBarSideBar from "../../components/TopBarSideBar"
import EmployeeLogin from "./Login";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import LanguageSelection from "./LanguageSelection";

const EmployeeApp = ({stateInfo, userDetails, CITIZEN, cityDetails, mobileView, handleUserDropdownSelection, logoUrl, DSO, stateCode, modules, appTenants, sourceUrl, pathname}) => {
    const { t } = useTranslation();
    const { path } = useRouteMatch();

    return (
      <div class="employee">
        <Switch>
          <Route path={`${path}/user`}>
            <TopBarSideBar
              t={t}
              stateInfo={stateInfo}
              userDetails={userDetails}
              CITIZEN={CITIZEN}
              cityDetails={cityDetails}
              mobileView={mobileView}
              handleUserDropdownSelection={handleUserDropdownSelection}
              logoUrl={logoUrl}
              showSidebar={false}
            />
            <div class="loginContainer" style={{ '--banner-url': `url(${stateInfo?.bannerUrl})` }}>
              <Switch>
                <Route path={`${path}/user/login`}><EmployeeLogin /></Route>
                <Route path={`${path}/user/forgot-password`}><ForgotPassword /></Route>
                <Route path={`${path}/user/change-password`}> <ChangePassword /></Route>
                <Route path={`${path}/user/language-selection`}>
                  <LanguageSelection />
                </Route>
                <Route>
                  <Redirect to={`${path}/user/language-selection`} />
                </Route>
              </Switch>
            </div>
          </Route>
          <Route>
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
              {/* <div style={{ overflowY: "auto" }}> */}
                  <div>
                      <AppModules stateCode={stateCode} userType="employee" modules={modules} appTenants={appTenants} />
                  </div>
                  <div className="employee-home-footer">
                      <img
                      src={`${sourceUrl}/digit-footer.png`}
                      style={{ height: "1.1em", cursor: "pointer" }}
                      onClick={() => {
                          window.open("https://www.digit.org/", "_blank").focus();
                      }}
                      />
                  </div>
              </div>
          </Route>
        </Switch>
      </div>
    )
}

export default EmployeeApp