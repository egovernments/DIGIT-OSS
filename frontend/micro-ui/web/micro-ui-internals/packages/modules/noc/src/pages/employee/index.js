import { PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApplicationOverview from "./ApplicationOverview";
import  Response  from "./Response";
import Inbox from "./Inbox";

const NOCBreadCrumbs = ({location}) =>{
  const { t } = useTranslation();
  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: "/digit-ui/employee/noc/inbox",
      content: t("ES_EVENT_INBOX"),
      show: location.pathname.includes("noc/inbox") ? true : false,
    },
    {
      path: "/digit-ui/employee/noc/inbox/details/:id",
      content: t("ES_EVENT_NEW_EVENT"),
      show: location.pathname.includes("noc/inbox/details") ? true : false,
    },
    {
      path: "/digit-ui/employee/event/inbox/event-details",
      content: t("ES_EVENT_EVENT_DETAILS"),
      show: location.pathname.includes("event-details") ? true : false,
    },
  
  ];

  return <BreadCrumb crumbs={crumbs} />;
}


const EmployeeApp = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();

  return (
    <Fragment>
     <NOCBreadCrumbs location={location} />
      <Switch>
        <PrivateRoute path={`${path}/inbox`} component={(props) => <Inbox {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/application-overview/:id`} component={ApplicationOverview} />
        <PrivateRoute path={`${path}/response`} component={Response} />
      </Switch>
    </Fragment>
  )
}

export default EmployeeApp;