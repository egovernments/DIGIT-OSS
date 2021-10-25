import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { format } from 'date-fns';
import { FormComposer, Header, Loader } from "@egovernments/digit-ui-react-components";
import { config } from "../NewMessageConfig";
import { isNestedArray, reduceDocsArray } from "../../../utils";

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
    
    
    const finalDocuments = isNestedArray(documents) ? reduceDocsArray(documents) : documents;
  
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
            documents : finalDocuments,
            fromDate: new Date(`${fromDate}`).getTime(),
            toDate: new Date(`${toDate}`).getTime(),
          }
        }
      ]
    }
    history.push("/digit-ui/employee/engagement/messages/response?update=true", details)
  }

  const defaultValues = useMemo(() => {
    const documents = data?.eventDetails?.documents
    return {
      name: data?.name,
      description: data?.description,
      documents: documents?.map(e => [e.fileName, {file: {name: e.fileName, type: e.documentType}, fileStoreId: {fileStoreId: e.fileStoreId, tenantId}}] ),
      fromDate: data ? format(new Date(data?.eventDetails?.fromDate), 'yyyy-MM-dd') : null,
      toDate: data ? format(new Date(data?.eventDetails?.toDate), 'yyyy-MM-dd') : null,
    }
  },[data])

  if (isLoading) {
    return (
      <Loader />
    );
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