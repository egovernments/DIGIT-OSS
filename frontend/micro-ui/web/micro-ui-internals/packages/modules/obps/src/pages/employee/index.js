import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApplicationDetail from "./ApplicationDetail";
import BpaApplicationDetail from "./BpaApplicationDetails";

const EmployeeApp = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();

  return (
    <Fragment>
      <Switch>
        <PrivateRoute path={`${path}/stakeholder/:id`} component={ApplicationDetail} />
        <PrivateRoute path={`${path}/bpa/:id`} component={BpaApplicationDetail} />
      </Switch>
    </Fragment>
  )
}

export default EmployeeApp;