import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import DocumentCategories from "./Documents/DocumentCategories";
import ViewDocument from "./Documents/ViewDocument";
import Response from "./CitizenSurvey/Response";

const CitizenApp = ({ path, url, userType, tenants }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const NotificationsOrWhatsNew = Digit.ComponentRegistryService.getComponent("NotificationsAndWhatsNew");
  const Events = Digit.ComponentRegistryService.getComponent("EventsListOnGround");
  const EventDetails = Digit.ComponentRegistryService.getComponent("EventDetails");
  const Documents = Digit.ComponentRegistryService.getComponent("DocumentList");
  const SurveyList = Digit.ComponentRegistryService.getComponent("SurveyList");
  const FillSurvey = Digit.ComponentRegistryService.getComponent("FillSurvey");
  const ShowSurvey = Digit.ComponentRegistryService.getComponent("ShowSurvey");
  return (
    <React.Fragment>
      <div className="engagement-citizen-wrapper">
        {!location.pathname.includes("response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
        <Switch>
          <Route path={`${path}/notifications`} component={() => <NotificationsOrWhatsNew variant="notifications" parentRoute={path} />} />
          <PrivateRoute path={`${path}/whats-new`} component={() => <NotificationsOrWhatsNew variant="whats-new" parentRoute={path} />} />
          <PrivateRoute exact path={`${path}/events`} component={() => <Events variant="events" parentRoute={path} />} />
          <PrivateRoute path={`${path}/events/details/:id`} component={() => <EventDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/docs`} component={() => <DocumentCategories t={t} {...{ path }} />} />
          <PrivateRoute path={`${path}/documents/viewDocument`} component={() => <ViewDocument t={t} {...{ path }} />} />
          <PrivateRoute path={`${path}/documents/list/:category/:count`} component={(props) => <Documents {...props} />} />
          <PrivateRoute path={`${path}/surveys/list`} component={(props) => <SurveyList {...props} />} />
          <PrivateRoute path={`${path}/surveys/fill-survey`} component={(props) => <FillSurvey {...props} />} />
          <PrivateRoute path={`${path}/surveys/submit-response`} component={(props) => <Response {...props} />} />
          <PrivateRoute path={`${path}/surveys/show-survey`} component={(props) => <ShowSurvey {...props} />} />
        </Switch>
      </div>
    </React.Fragment>
  );
};
export default CitizenApp;
