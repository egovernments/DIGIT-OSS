import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import TopBarSideBar from "../../components/TopBarSideBar"
import { AppHome } from "../../components/Home";
import CitizenHome from "./Home";
import LanguageSelection from "./Home/LanguageSelection";
import LocationSelection from "./Home/LocationSelection";
import Login from "./Login";
import { BackButton } from "@egovernments/digit-ui-react-components";


const getTenants = (codes, tenants) => {
    return tenants.filter((tenant) => codes.map((item) => item.code).includes(tenant.code));
};

const Home = ({stateInfo, userDetails, CITIZEN, cityDetails, mobileView, handleUserDropdownSelection, logoUrl, DSO, stateCode, modules, appTenants, sourceUrl, pathname}) => {
    const classname = Digit.Hooks.fsm.useRouteSubscription(pathname);
    const { t } = useTranslation();
    const { path } = useRouteMatch();

    const appRoutes = modules.map(({ code, tenants }, index) => {
        const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
        return <Route key={index} path={`${path}/${code.toLowerCase()}`}>
                <Module stateCode={stateCode} moduleCode={code} userType="citizen" tenants={getTenants(tenants, appTenants)} />
            </Route>
    });

    const ModuleLevelLinkHomePages = modules.map(({ code }, index) => {
        let Links = Digit.ComponentRegistryService.getComponent(`${code}Links`) || (() => <React.Fragment />);
        return <Route key={index} path={`${path}/${code.toLowerCase()}-home`}>
                <div className="moduleLinkHomePage">
                    <img src={stateInfo?.bannerUrl}/>
                    <BackButton className="moduleLinkHomePageBackButton"/>
                    <h1>{t("MODULE_"+code.toUpperCase())}</h1>
                </div>
                <div className="moduleLinkHomePageModuleLinks">
                    <Links key={index} matchPath={`/digit-ui/citizen/${code.toLowerCase()}`} userType={"citizen"} />
                </div>
            </Route>  
    })

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
        <div className={`main center-container mb-25`}>
            <Switch>
                <Route exact path={path}>
                    <CitizenHome />
                </Route>

                <Route exact path={`${path}/select-language`}>
                    <LanguageSelection />
                </Route>

                <Route exact path={`${path}/select-location`}>
                    <LocationSelection />
                </Route>

                <Route path={`${path}/all-services`}>
                    <AppHome userType="citizen" modules={modules} />
                </Route>

                <Route path={`${path}/login`}> <Login stateCode={stateCode} /></Route>
                
                <Route path={`${path}/register`}>
                    <Login stateCode={stateCode} isUserRegistered={false} />
                </Route>
        
                {appRoutes}

                {ModuleLevelLinkHomePages}

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