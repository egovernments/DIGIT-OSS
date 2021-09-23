import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { config } from "../../NewEventConfig";

const NewEvents = () => {
  const { t } = useTranslation();
  const history = useHistory();

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

  return (
    <Fragment>
      <Header>{t("ES_TITLE_NEW_EVENTS")}</Header>
      <FormComposer
        config={config}
        onSubmit={onSubmit}
        label={t("EVENTS_CREATE_EVENT")}
      >
      </FormComposer>
    </Fragment>
  )
}

export default NewEvents;