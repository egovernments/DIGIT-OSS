import { BackButton, BreadCrumb, CitizenHomeCard, CitizenTruck, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Redirect, Switch, useLocation, useRouteMatch,Route } from "react-router-dom";

import Documents from "./pages/employee/documents"

import EngagementCard from "./components/EngagementCard"
import EngagementDocSelectULB from "./components/EngagementDocsULB"
import EnagementDocName from "./components/engagement-doc-name"
import EngagementDocCategory from "./components/engagement-doc-category"
import EngagementDocDescription from "./components/engagement-doc-description"
import EngagementDocUploadDocument from "./components/engagement-doc-documents"


const EmployeeApp = ({ path, url, userType }) => {
  const location = useLocation();

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
            <Route exact path={`${path}/docs`} component={()=><Documents {...{path}} />} />
            <Redirect to={`${path}/docs`} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

const EngagementModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "Engagement";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);

  if (userType === "citizen") {
    return null
  } else {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  }
};

const EngagementLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  if (userType === "citizen") {
    return null
  } else {
    return (
      <div className="employee-app-container">
        <div className="ground-container">
          <div className="employeeCard">
            <div className="complaint-links-container">
              <div className="header">
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                      fill="white"
                    ></path>
                  </svg>
                </span>
                <span className="text">{t("ES_TITLE_ENGAGEMENT")}</span>
              </div>
              <div className="body">
                <h1>engagement</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const componentsToRegister = {
    EngagementModule,
    EngagementCard,
    EngagementDocSelectULB,
    EnagementDocName,
    EngagementDocCategory,
    EngagementDocDescription,
    EngagementDocUploadDocument,
};

export const initEngagementComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};