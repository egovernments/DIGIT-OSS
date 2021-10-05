import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApplicationDetail from "./ApplicationDetail";
import BpaApplicationDetail from "./BpaApplicationDetails";
import Search from "./Search";

const EmployeeApp = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();

  return (
    <Fragment>
      <Switch>
        <PrivateRoute path={`${path}/stakeholder/:id`} component={ApplicationDetail} />
        <PrivateRoute path={`${path}/bpa/:id`} component={BpaApplicationDetail} />
        <PrivateRoute path={`${path}/search/application`} component={(props) => <Search {...props} parentRoute={path} />} />
      </Switch>
    </Fragment>
  )
}

export default EmployeeApp;