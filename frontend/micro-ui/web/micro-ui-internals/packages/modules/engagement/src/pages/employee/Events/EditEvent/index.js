import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { format } from 'date-fns';
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

  const onSubmit = (formData) => {
    const { fromDate, toDate, fromTime, toTime, address, organizer, fees, geoLocation } = formData;
    const details = {
      events: [
        {
          ...data,
          source: "WEBAPP",
          status: "ACTIVE",
          eventType: "EVENTSONGROUND",
          tenantId: formData?.tenantId?.code,
          description: formData?.description,
          name: formData?.name,
          eventcategory: formData?.eventCategory?.code,
          eventDetails: {
            ...data?.eventDetails,
            fromDate: new Date(`${fromDate} ${fromTime}`).getTime(),
            toDate: new Date(`${toDate} ${toTime}`).getTime(),
            fromTime,
            toTime,
            address,
            organizer,
            fees,
            latitude: geoLocation?.latitude,
            longitude: geoLocation?.longitude
          }
        }
      ]
    }
    history.push("/digit-ui/employee/engagement/event/response?update=true", details)
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }

  const defaultValues = {
    name: data?.name,
    fromDate: format(new Date(data?.eventDetails?.fromDate), 'yyyy-MM-dd'),
    toDate: format(new Date(data?.eventDetails?.toDate), 'yyyy-MM-dd'),
    organizer: data?.eventDetails?.organizer,
    fees: data?.eventDetails?.fees,
    description: data?.description,
    address: data?.eventDetails?.address,
    category: data?.eventCategory,
    fromTime: format(new Date(data?.eventDetails?.fromDate), 'hh:mm'),
    toTime: format(new Date(data?.eventDetails?.toDate), 'hh:mm'),
    geoLocation: {
      latitude: data?.eventDetails?.latitude,
      longitude: data?.eventDetails?.longitude,
    }
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