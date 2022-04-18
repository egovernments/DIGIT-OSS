import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages";
import ReportsCard from "./components/ReportsCard";
import ReportSearchApplication from "./components/ReportSearchApplication";

export const ReportsModule = ({ stateCode, userType }) => {
    const moduleCode = "REPORTS";
    const state = useSelector((state) => state);
    const language = state?.common?.selectedLanguage;
    const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
    const { path, url } = useRouteMatch();
    if (userType === "employee") {
        return <EmployeeApp path={path} url={url} userType={"employee"} />;
    } else return null;
};

const componentsToRegister = {
    ReportsModule,
    ReportsCard,
    ReportSearchApplication
};

export const initReportsComponents = () => {
    Object.entries(componentsToRegister).forEach(([key, value]) => {
        Digit.ComponentRegistryService.setComponent(key, value);
    });
};
