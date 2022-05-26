import { Card, CardCaption, Header, Loader, OnGroundEventCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect, useHistory, useLocation } from "react-router-dom";

const EventsListOnGround = ({ variant, parentRoute }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const tenantId = Digit.ULBService.getCitizenCurrentTenant();
  const { data: { unreadCount: preVisitUnseenEventsCount } = {}, isSuccess: preVisitUnseenEventsCountLoaded } = Digit.Hooks.useNotificationCount({
    tenantId,
    config: {
      enabled: !!Digit.UserService?.getUser()?.access_token,
    },
  });

  const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({ tenantId, variant });

  if (!Digit.UserService?.getUser()?.access_token) {
    localStorage.clear();
    sessionStorage.clear();
    return <Redirect to={{ pathname: `/digit-ui/citizen/login`, state: { from: location.pathname + location.search } }} />;
  }

  if (EventsDataLoading || !preVisitUnseenEventsCountLoaded) return <Loader />;

  function onEventCardClick(id) {
    history.push(parentRoute + "/events/details/" + id);
  }

  return (
    <div className="CitizenEngagementNotificationWrapper">
      <Header>{`${t("EVENTS_EVENTS_HEADER")}(${EventsData?.length})`}</Header>
      {EventsData.length ? (
        EventsData.map((DataParamsInEvent) => <OnGroundEventCard onClick={onEventCardClick} {...DataParamsInEvent} />)
      ) : (
        <Card>
          <CardCaption>{t("COMMON_INBOX_NO_DATA")}</CardCaption>
        </Card>
      )}
    </div>
  );
};

export default EventsListOnGround;
