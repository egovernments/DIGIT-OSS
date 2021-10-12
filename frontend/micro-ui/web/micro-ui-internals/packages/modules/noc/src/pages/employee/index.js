import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApplicationOverview from "./ApplicationOverview";
import  Response  from "./Response";
import Inbox from "./Inbox";

const EmployeeApp = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();

  return (
    <Fragment>
      <Switch>
        <PrivateRoute path={`${path}/inbox`} component={(props) => <Inbox {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/application-overview/:id`} component={ApplicationOverview} />
        <PrivateRoute path={`${path}/response`} component={Response} />
      </Switch>
    </Fragment>
  )
}

export default EmployeeApp;