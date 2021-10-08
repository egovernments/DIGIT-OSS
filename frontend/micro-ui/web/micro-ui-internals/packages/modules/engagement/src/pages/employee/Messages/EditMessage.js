import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { format } from 'date-fns';
import { FormComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { config } from "../NewMessageConfig";

const EditMessage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { id: MessageId } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, data } = Digit.Hooks.events.useInbox(tenantId, {},
  { eventTypes: "BROADCAST",
    ids: MessageId
  }, 
  {
    select: (data) => data?.events?.[0]
  });

  const onSubmit = (formData) => {
    const { fromDate, toDate, description, name, documents } = formData;

    const details = {
      events: [
        {
          ...data,
          source: "WEBAPP",
          status: "ACTIVE",
          eventType: "BROADCAST",
          tenantId: formData?.tenantId?.code,
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
    history.push("/digit-ui/employee/engagement/messages/response?update=true", details)
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
  }

  return (
    <Fragment>
      <Header>{t("EDIT_NEW_PUBLIC_MESSAGE")}</Header>
      <FormComposer
        defaultValues={defaultValues}
        config={config}
        onSubmit={onSubmit}
        label={t("ACTION_EDIT_MESSAGE")}
      >
      </FormComposer>
    </Fragment>
  )
}

export default EditMessage;