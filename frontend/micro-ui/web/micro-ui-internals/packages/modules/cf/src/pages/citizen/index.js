import React from "react";
import { Route, useRouteMatch, Switch, useLocation } from "react-router-dom";
import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import Response from '../../components/Response';
import CitizenFeedbackHome from "./CitizenFeedbackHome";
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  const { path, url, ...match } = useRouteMatch();
  const location = useLocation();
  return (
    <React.Fragment>
      <BackButton>{t("CS_COMMON_BACK")}</BackButton>
      <Switch>
        <PrivateRoute path={`${path}/response`} component={() => <Response match={{ ...match, url, path }} />} />
        {/* <PrivateRoute path={`${path}/response/:id*`} component={() => <Response match={{ ...match, url, path }} />} /> */}
        <PrivateRoute path={`${path}/`} component={() => <CitizenFeedbackHome header={t("CS_COMMON_HOME_COMPLAINTS")} />} />
      </Switch>
    </React.Fragment>
  );
};

export default App;