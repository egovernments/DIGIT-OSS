import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { FormComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { config } from "../../NewEventConfig";

const EditEvents = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { id: EventId } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, data } = Digit.Hooks.events.useInbox(tenantId, {},
  { eventTypes: "EVENTSONGROUND",
    ids: EventId
  }, 
  {
    select: (data) => data?.events?.[0]
  });

  const onSubmit = (data) => {
    const { fromDate, toDate, fromTime, toTime, address, organizer, fees, geoLocation } = data;
    const details = {
      events: [
        {
          source: "WEBAPP",
          eventType: "EVENTSONGROUND",
          tenantId: data?.tenantId?.code,
          description: data?.description,
          name: data?.name,
          eventcategory: data?.eventCategory?.code,
          eventDetails: {
            fromDate: new Date(`${fromDate} ${fromTime}`).getTime(),
            toDate: new Date(`${toDate} ${toTime}`).getTime(),
            fromTime,
            toTime,
            address,
            organizer,
            fees,
          }
        }
      ]
    }
    history.push("/digit-ui/employee/engagement/event/response", details)
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }

  const defaultValues = {
    name: data?.name,
    // fromDate: '30-10-2021',
    // toDate: '30-09-2021',
    organizer: data?.eventDetails?.organizer,
    fees: data?.eventDetails?.fees,
    description: data?.description,
    address: data?.eventDetails?.address,
    category: data?.eventCategory,
    fromTime: (new Date(data?.eventDetails?.fromDate*1000)+'').slice(17,22),
    toTime: (new Date(data?.eventDetails?.toDate*1000)+'').slice(17,22),
  }

  return (
    <Fragment>
      <Header>{t("ES_TITLE_EDIT_EVENTS")}</Header>
      <FormComposer
        defaultValues={defaultValues}
        config={config}
        onSubmit={onSubmit}
        label={t("EVENTS_EDIT_EVENT")}
      >
      </FormComposer>
    </Fragment>
  )
}

export default EditEvents;