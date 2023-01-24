import { Clock, Header, Loader, MapMarker, OnGroundEventCard } from "@egovernments/digit-ui-react-components";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, useHistory, useLocation, useParams } from "react-router-dom";

const EventDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const { id: EventId } = useParams();

  const tenantId = Digit.ULBService.getCitizenCurrentTenant();

  const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({ tenantId, variant: "events" });

  if (!Digit.UserService?.getUser()?.access_token) {
    localStorage.clear();
    sessionStorage.clear();
    return <Redirect to={{ pathname: `/${window?.contextPath}/citizen/login`, state: { from: location.pathname + location.search } }} />;
  }

  function onGroundEventCardPropsForEventDetails(DataParamsInEvent) {
    const { eventCategory, name, onGroundEventDate, onGroundEventMonth, onGroundEventTimeRange } = DataParamsInEvent;
    return { eventCategory: t(eventCategory), showEventCatergory: true, name, onGroundEventDate, onGroundEventMonth, onGroundEventTimeRange };
  }

  const FilteredEventForThisPage = useMemo(() => (!EventsDataLoading ? EventsData?.filter((i) => i.id === EventId)[0] : null), [
    EventsDataLoading,
    EventsData,
  ]);

  if (EventsDataLoading) return <Loader />;
  return (
    <div className="CitizenEngagementNotificationWrapper">
      <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      <OnGroundEventCard {...onGroundEventCardPropsForEventDetails(FilteredEventForThisPage)} />
      <div className="OnGroundEventDetailsCard">
        <p className="cardCaptionBodyS">{FilteredEventForThisPage?.description}</p>
        <div className="eventAddressAndDirection">
          <span>
            <MapMarker />
            <div>
              <p>{FilteredEventForThisPage?.eventDetails?.address}</p>
              {FilteredEventForThisPage?.eventDetails?.latitude && FilteredEventForThisPage?.eventDetails?.longitude ? (
                <a
                  className="direction"
                  target="_blank"
                  href={`https://www.google.com/maps/search/?api=1&query=${FilteredEventForThisPage?.eventDetails?.latitude}%2C${FilteredEventForThisPage?.eventDetails?.longitude}`}
                >
                  {t("CS_COMMON_GET_DIRECTIONS")}
                </a>
              ) : null}
            </div>
          </span>
        </div>
        <div className="eventTimeRange">
          <Clock />
          <p>{FilteredEventForThisPage?.onGroundEventTimeRange}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
