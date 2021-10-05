import React from "react"
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import { BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import DocumentCategories from "./Documents/DocumentCategories";

const CitizenApp = ({ path, url, userType, tenants}) => {
    const location = useLocation();
    const { t } = useTranslation();
    const NotificationsOrWhatsNew = Digit.ComponentRegistryService.getComponent("NotificationsAndWhatsNew")
    const Events = Digit.ComponentRegistryService.getComponent("EventsListOnGround")
    const EventDetails = Digit.ComponentRegistryService.getComponent("EventDetails")
    const Documents = Digit.ComponentRegistryService.getComponent("DocumentList")
    const SurveyList = Digit.ComponentRegistryService.getComponent("SurveyList")

    return (
      <React.Fragment>
        <BackButton>{t("CS_COMMON_BACK")}</BackButton>
        <Switch>
          <PrivateRoute
            path={`${path}/notifications`}
            component={() => <NotificationsOrWhatsNew variant="notifications" parentRoute={path} />}
          />
          <PrivateRoute
            path={`${path}/whats-new`}
            component={() => <NotificationsOrWhatsNew variant="whats-new" parentRoute={path} />}
          />
          <PrivateRoute
            exact
            path={`${path}/events`}
            component={() => <Events variant="events" parentRoute={path} />}
          />
          <PrivateRoute
            path={`${path}/events/details/:id`}
            component={() => <EventDetails parentRoute={path} />}
          />
          <PrivateRoute path={`${path}/docs`} component={() => <DocumentCategories t={t} {...{ path }} />} />
          <PrivateRoute path={`${path}/documents/list/:category`} component={(props) => <Documents {...props} tenants={tenants} />} />
          <PrivateRoute path={`${path}/SurveyList`} component={(props) => <SurveyList {...props} />} />
        </Switch>
      </React.Fragment>
    );
};
export default CitizenApp