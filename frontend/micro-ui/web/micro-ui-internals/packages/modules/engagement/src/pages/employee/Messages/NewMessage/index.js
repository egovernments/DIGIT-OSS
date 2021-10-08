import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { config } from "../../NewMessageConfig";

const NewEvents = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const onSubmit = (data) => {
    const { fromDate, toDate, description, name, documents } = data;
    const details = {
      events: [
        {
          recepient: null,
          source: "WEBAPP",
          eventType: "BROADCAST",
          tenantId: data?.tenantId?.code,
          description,
          name,
          eventDetails: {
            documents,
            fromDate: new Date(`${fromDate}`).getTime(),
            toDate: new Date(`${toDate}`).getTime(),
          }
        }
      ]
    }
    debugger
    history.push("/digit-ui/employee/engagement/messages/response", details)
  }

  return (
    <Fragment>
      <Header>{t("ADD_NEW_PUBLIC_MESSAGE")}</Header>
      <FormComposer
        config={config}
        onSubmit={onSubmit}
        label={t("ACTION_ADD_NEW_MESSAGE")}
      >
      </FormComposer>
    </Fragment>
  )
}

export default NewEvents;