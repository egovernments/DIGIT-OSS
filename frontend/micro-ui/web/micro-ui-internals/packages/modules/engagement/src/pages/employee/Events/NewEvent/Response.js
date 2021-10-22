import { Banner, Card, Loader, CardText, SubmitBar, ActionBar } from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const BannerPicker = (props) => {
  const { t } = useTranslation();
  return (
    <Banner
      message={t(props.message)}
      applicationNumber={props?.data?.events?.[0]?.name}
      info={t(`ENGAGEMENT_EVENT_NAME`)}
      successful={props.isSuccess}
    />
  )
}

const Response = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const searchParams = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.events.useCreateEvent();
  const updateEventMutation = Digit.Hooks.events.useUpdateEvent();
  const { state } = props.location;

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
    }
    if (searchParams?.delete || searchParams?.update) {
      updateEventMutation.mutate(state, {
        onSuccess
      });
      return;
    }
    mutation.mutate(state, {
      onSuccess
    })
  }, []);

  if (searchParams?.delete || searchParams?.update) {
    if (updateEventMutation.isLoading || updateEventMutation.isIdle) {
      return <Loader />
    }

    return (
      <Card>
        <BannerPicker
          t={t}
          message={searchParams?.update ? updateEventMutation.isSuccess ? 'ENGAGEMENT_EVENT_UPDATED' : `ENGAGEMENT_EVENT_UPDATED_FAILED` : updateEventMutation.isSuccess ? 'ENGAGEMENT_EVENT_DELETED' : 'ENGAGEMENT_EVENT_DELETED_FAILED'}
          data={updateEventMutation.data}
          isSuccess={updateEventMutation.isSuccess}
          isLoading={updateEventMutation.isIdle || updateEventMutation.isLoading}
        />
        <CardText>
          {searchParams?.update ? t(`ENGAGEMENT_EVENT_UPDATED_MESSAGES`) : t(`ENGAGEMENT_EVENT_DELETED_MESSAGES`)}
        </CardText>
        <ActionBar>
          <Link to={"/digit-ui/employee"}>
            <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
          </Link>
        </ActionBar>
      </Card>
    )
  }

  if (mutation.isLoading || mutation.isIdle) {
    return <Loader />
  }
  return (
    <Card>
      <BannerPicker
        t={t}
        message={`ENGAGEMENT_EVENT_CREATED`}
        data={mutation.data}
        isSuccess={mutation.isSuccess}
        isLoading={mutation.isIdle || mutation.isLoading}
      />
      <CardText>
        {mutation.isSuccess ? t(`ENGAGEMENT_EVENT_CREATED_MESSAGE`, {
        eventName: mutation?.data?.events?.[0]?.name,
        fromDate: Digit.DateUtils.ConvertTimestampToDate(mutation?.data?.events?.[0]?.eventDetails?.fromDate),
        toDate: Digit.DateUtils.ConvertTimestampToDate(mutation?.data?.events?.[0]?.eventDetails?.toDate),
        fromTime: mutation.isSuccess ? format(new Date(mutation?.data?.events?.[0]?.eventDetails?.fromDate), 'HH:mm') : null,
        toTime: mutation.isSuccess ? format(new Date(mutation?.data?.events?.[0]?.eventDetails?.toDate), 'HH:mm') : null,
      }) : t(`ENGAGEMENT_EVENT_FAILED_MESSAGES`)}
      </CardText>
      <ActionBar>
        <Link to={"/digit-ui/employee"}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </Card>
  )
}

export default Response;