import React from "react";
import { useTranslation } from "react-i18next";
import { AppModules } from "../../components/AppModules";
import TopBarSideBar from "../../components/TopBarSideBar"

const CitizenApp = ({stateInfo, userDetails, CITIZEN, cityDetails, mobileView, handleUserDropdownSelection, logoUrl, DSO, stateCode, modules, appTenants, sourceUrl, pathname}) => {
    const { t } = useTranslation();
    const classname = Digit.Hooks.fsm.useRouteSubscription(pathname);

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
            <AppModules stateCode={stateCode} userType="citizen" modules={modules} appTenants={appTenants} />
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
    </div>
}

export default CitizenApp