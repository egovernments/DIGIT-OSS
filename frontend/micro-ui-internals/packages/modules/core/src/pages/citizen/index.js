import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import TopBarSideBar from "../../components/TopBarSideBar"
import { AppHome } from "../../components/Home";
import Login from "./Login";


const getTenants = (codes, tenants) => {
    return tenants.filter((tenant) => codes.map((item) => item.code).includes(tenant.code));
};

const Home = ({stateInfo, userDetails, CITIZEN, cityDetails, mobileView, handleUserDropdownSelection, logoUrl, DSO, stateCode, modules, appTenants, sourceUrl, pathname}) => {
    const classname = Digit.Hooks.fsm.useRouteSubscription(pathname);
    const { t } = useTranslation();
    const { path } = useRouteMatch();

    const appRoutes = modules.map(({ code, tenants }, index) => {
        const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
        return (
          <Route key={index} path={`${path}/${code.toLowerCase()}`}>
            <Module stateCode={stateCode} moduleCode={code} userType="citizen" tenants={getTenants(tenants, appTenants)} />
          </Route>
        );
    });

    return <div className={classname}>
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
        <div className={`main center-container mb-50`}>
            <Switch>
                <Route exact path={path}>

                        <h1>CITIZEN HOME</h1>
                </Route>

                <Route path={`${path}/all-services`}>
                    <AppHome userType="citizen" modules={modules} />
                </Route>

                <Route path={`${path}/login`}> <Login stateCode={stateCode} /></Route>
                
                <Route path={`${path}/register`}>
                    <Login stateCode={stateCode} isUserRegistered={false} />
                </Route>
        
                {appRoutes}

            </Switch>
        </div>
        <div className="citizen-home-footer">
            <img
                src={`${sourceUrl}/digit-footer.png`}
                style={{ height: "1.2em", cursor: "pointer" }}
                onClick={() => {
                    window.open("https://www.digit.org/", "_blank").focus();
                }}
            />
        </div>
    </div>

}

export default Home