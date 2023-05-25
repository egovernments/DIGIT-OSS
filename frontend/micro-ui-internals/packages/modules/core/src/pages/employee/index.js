import React from "react";
import { useTranslation } from "react-i18next";
import { AppModules } from "../../components/AppModules";
import TopBarSideBar from "../../components/TopBarSideBar"

const EmployeeApp = ({stateInfo, userDetails, CITIZEN, cityDetails, mobileView, handleUserDropdownSelection, logoUrl, DSO, stateCode, modules, appTenants, sourceUrl, pathname}) => {
    const { t } = useTranslation();

    return <div className="employee">
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
    </div>
}

export default EmployeeApp