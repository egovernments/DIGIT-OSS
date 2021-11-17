import { PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApplicationOverview from "./ApplicationOverview";
// import  Response  from "./Response";
import Inbox from "./Inbox";


const NOCBreadCrumbs = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: "/digit-ui/employee/noc/inbox",
      content: t("ES_COMMON_INBOX"),
      show: location.pathname.includes("noc/inbox") ? true : false,
    },
    {
      path: "/digit-ui/employee/noc/inbox/application-overview/:id",
      content: t("NOC_APP_OVER_VIEW_HEADER"),
      show: location.pathname.includes("noc/inbox/application-overview") ? true : false,
    }
  ];

  return <BreadCrumb crumbs={crumbs} />;
}


const EmployeeApp = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();

  return (
    <Fragment>
      <div style={window.location.href.includes("application-overview") ? {marginLeft: "10px"} : {}}><NOCBreadCrumbs location={location} /></div>
      <Switch>
        <PrivateRoute path={`${path}/inbox/application-overview/:id`} component={ApplicationOverview} />
        <PrivateRoute path={`${path}/inbox`} component={(props) => <Inbox {...props} parentRoute={path} />} />
        {/* <PrivateRoute path={`${path}/response`} component={Response} /> */}
      </Switch>
    </Fragment>
  )
}

export default EmployeeApp;