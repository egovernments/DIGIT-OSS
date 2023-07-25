import { CitizenHomeCard, PTIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import CitizenApp from "./pages/citizen";
import Create from "./pages/citizen/create/index";
import EmployeeApp from "./pages/employee";
import BrSelectName from "./pagecomponents/BrSelectName";
import BRSelectPhoneNumber from "./pagecomponents/BrSelectPhoneNumber";
import BRSelectGender from "./pagecomponents/BRSelectGender";
import BRSelectEmailId from "./pagecomponents/SelectEmailId";
import BRSelectPincode from "./pagecomponents/BRSelectPincode";
import BrSelectAddress from "./pagecomponents/BrSelectAddress";
import SelectCorrespondenceAddress from "./pagecomponents/SelectCorrespondenceAddress";
import SelectDocuments from "./pagecomponents/SelectDocuments";
import BRCard from "./components/config/BRCard";
import BRManageApplication from "./pages/employee/BRManageApplication";
import RegisterDetails from "./pages/employee/RegisterDetails";
import Response from "./pages/citizen/create/Response";

const componentsToRegister = {
    Response,
    FSCreate: Create,
};

export const FSModule = ({ stateCode, userType, tenants }) => {
    const { path, url } = useRouteMatch();

    const moduleCode = "FS";
    const language = Digit.StoreData.getCurrentLanguage();
    const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

    if (userType === "citizen") {
        return <CitizenApp path={path} stateCode={stateCode} />;
    }

    return <EmployeeApp path={path} stateCode={stateCode} />;
};

export const FSLinks = ({ matchPath, userType }) => {
    const { t } = useTranslation();
    const links = [
        {
            link: `${matchPath}/birth`,
            i18nKey: t("Create FarmerSurvey"),
        },
    ];

    return <CitizenHomeCard header={t("FarmerSurvey")} links={links} Icon={() => <PTIcon className="fill-path-primary-main" />} />;
};

export const initFSComponents = () => {
    Object.entries(componentsToRegister).forEach(([key, value]) => {
        Digit.ComponentRegistryService.setComponent(key, value);
    });
};

