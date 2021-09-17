import React from "react"
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import { BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import DocumentList from "./Documents/DocumentList";
import NoticesAndCirculars from "./Documents/NoticesAndCirculars";

const CitizenApp = ({ path, url, userType}) => {
    const location = useLocation();
    const { t } = useTranslation();
    const NotificationsOrWhatsNew = Digit.ComponentRegistryService.getComponent("NotificationsAndWhatsNew")
    const Events = Digit.ComponentRegistryService.getComponent("EventsListOnGround")
    const EventDetails = Digit.ComponentRegistryService.getComponent("EventDetails")
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
          <PrivateRoute path={`${path}/docs`} component={() => <DocumentList {...{ path }} />} />
          <PrivateRoute path={`${path}/notice_and_circulars`} component={() => <NoticesAndCirculars {...{ path }} />} />
        </Switch>
      </React.Fragment>
    );
};
export default CitizenApp