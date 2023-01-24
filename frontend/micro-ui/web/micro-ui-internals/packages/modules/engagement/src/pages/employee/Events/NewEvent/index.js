import { FormComposer, Header } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { config } from "../../../../config/NewEventConfig";

const NewEvents = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const onSubmit = (data) => {
    const { fromDate, toDate, fromTime, toTime, address, organizer, fees, geoLocation = {} } = data;
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
            ...geoLocation
          }
        }
      ]
    }
    history.push(`/${window?.contextPath}/employee/engagement/event/response`, details)
  }

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_EVENT_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_EVENT_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_EVENT_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

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