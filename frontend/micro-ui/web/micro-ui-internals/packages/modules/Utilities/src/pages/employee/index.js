import { AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch } from "react-router-dom";
import DynamicSearchComponent from "./DynamicSearchComponent";
import IFrameInterface from "./IFrameInterface";
import WorkflowCompTest from "./WorkflowComponentTest";

const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      path: `/${window?.contextPath}/employee`,
      content: t(location.pathname.split("/").pop()),
      show: true,
    },
  ];
  return <BreadCrumb crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
  const commonProps = { stateCode, userType, tenants, path };

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <Route path={`${path}/search/:moduleName/:masterName`} component={() => <DynamicSearchComponent parentRoute={path} />} />
        <Route path={`${path}/create/:moduleName/:masterName`} component={() => <DynamicCreateComponent parentRoute={path} />} />
        <Route path={`${path}/iframe/:moduleName/:pageName`}>
          <IFrameInterface {...commonProps} />
        </Route>
        <Route path={`${path}/workflow`} component={() => <WorkflowCompTest parentRoute={path} />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
