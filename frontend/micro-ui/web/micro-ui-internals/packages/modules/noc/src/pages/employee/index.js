import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApplicationOverview from "./ApplicationOverview";

const EmployeeApp = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();

  return (
    <Fragment>
      <Switch>
        <PrivateRoute path={`${path}/application-overview/:id`} component={ApplicationOverview} />
      </Switch>
    </Fragment>
  )
}

export default EmployeeApp;