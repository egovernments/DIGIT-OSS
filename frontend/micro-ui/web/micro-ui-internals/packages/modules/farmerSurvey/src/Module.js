import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages/employee";
import Farmerpage from "./pages";

const componentsToRegister = {
    Farmerpage
};

export const FSModule = ({ stateCode, userType, tenants }) => {
    const { path, url } = useRouteMatch();

    const moduleCode = "BR";
    const language = Digit.StoreData.getCurrentLanguage();
    const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

    return <EmployeeApp path={path} stateCode={stateCode} />;
};

export const BRLinks = ({ matchPath, userType }) => {
    const { t } = useTranslation();
    const links = [
        {
            link: `${matchPath}/farmer-survey`,
            i18nKey: t("Farmer Survey"),
        },

    ];

    return <h1>fdsdfsdfsdfsdfwefsdfds</h1>;
};

export const initBRComponents = () => {
    Object.entries(componentsToRegister).forEach(([key, value]) => {
        Digit.ComponentRegistryService.setComponent(key, value);
    });
};

