import React from "react";
import { ReopenComplaint } from "./ReopenComplaint/index";
import SelectRating from "./Rating/SelectRating";
import { PgrRoutes, getRoute } from "../../constants/Routes";
import { useRouteMatch, Switch, useLocation } from "react-router-dom";
import { AppContainer, BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";

import { CreateComplaint } from "./Create";
import { ComplaintsList } from "./ComplaintsList";
import ComplaintDetailsPage from "./ComplaintDetails";
import Response from "./Response";
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  const { path, url, ...match } = useRouteMatch();
  const location = useLocation();

  const CreateComplaint = Digit?.ComponentRegistryService?.getComponent("PGRCreateComplaintCitizen");
  const ComplaintsList = Digit?.ComponentRegistryService?.getComponent("PGRComplaintsList");
  const ComplaintDetailsPage = Digit?.ComponentRegistryService?.getComponent("PGRComplaintDetailsPage");
  const SelectRating = Digit?.ComponentRegistryService?.getComponent("PGRSelectRating");
  const Response = Digit?.ComponentRegistryService?.getComponent("PGRResponseCitzen");

  return (
    <React.Fragment>
      <div className="pgr-citizen-wrapper">
        {!location.pathname.includes("/response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
        <Switch>
          {/* <AppContainer> */}
          <PrivateRoute path={`${path}/create-complaint`} component={CreateComplaint} />
          <PrivateRoute path={`${path}/complaints`} exact component={ComplaintsList} />
          <PrivateRoute path={`${path}/complaints/:id*`} component={ComplaintDetailsPage} />
          <PrivateRoute
            path={`${path}/reopen`}
            component={() => <ReopenComplaint match={{ ...match, url, path: `${path}/reopen` }} parentRoute={path} />}
          />
          <PrivateRoute path={`${path}/rate/:id*`} component={() => <SelectRating parentRoute={path} />} />
          <PrivateRoute path={`${path}/response`} component={() => <Response match={{ ...match, url, path }} />} />

          {/* </AppContainer> */}
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default App;
