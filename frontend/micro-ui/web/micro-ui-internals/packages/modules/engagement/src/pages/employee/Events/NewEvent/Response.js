import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

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
  const [isSuccess, setIsSuccess] = useState(false)
  const { state } = props.location;

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_EVENT_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_EVENT_MUTATION_SUCCESS_DATA", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_EVENT_ERROR_DATA", false);


  const onError = (error, variables) => {
    setErrorInfo(error?.response?.data?.Errors[0]?.code || 'ERROR');
    setMutationHappened(true);
  };

  useEffect(() => {
    if (mutation.data) setsuccessData(mutation.data);
  }, [mutation.data]);
  useEffect(() => {
    if (updateEventMutation.data) setsuccessData(updateEventMutation.data);
  }, [updateEventMutation.data]);

  useEffect(() => {
    const onSuccess = () => {
      setMutationHappened(true);
      queryClient.clear();
    }
    if (!mutationHappened) {
      if (Boolean(searchParams?.delete) || Boolean(searchParams?.update)) {
        updateEventMutation.mutate(state, {
          onError,
          onSuccess,
        });
        return;
      }
      mutation.mutate(state, {
        onError,
        onSuccess,
      })
      return;
    }
    return () => {
      queryClient.clear();
    };
  }, []);

  if (searchParams?.delete || searchParams?.update) {
    if (updateEventMutation.isLoading || (updateEventMutation.isIdle && !mutationHappened)) {
      return <Loader />
    }

    return (
      <Card>
        <BannerPicker
          t={t}
          message={searchParams?.update ? (updateEventMutation.isSuccess || successData) ? 'ENGAGEMENT_EVENT_UPDATED' : `ENGAGEMENT_EVENT_UPDATED_FAILED` : (updateEventMutation.isSuccess || successData) ? 'ENGAGEMENT_EVENT_DELETED' : 'ENGAGEMENT_EVENT_DELETED_FAILED'}
          data={updateEventMutation.data || successData}
          isSuccess={updateEventMutation?.isSuccess || successData}
          isLoading={(updateEventMutation.isIdle && !mutationHappened) || updateEventMutation.isLoading}
        />
        <CardText>
        {searchParams?.update ? (updateEventMutation.isSuccess || successData) ? t('ENGAGEMENT_EVENT_UPDATED') : t(`ENGAGEMENT_EVENT_UPDATED_FAILED`) : (updateEventMutation.isSuccess || successData) ? t('ENGAGEMENT_EVENT_DELETED') : t('ENGAGEMENT_EVENT_DELETED_FAILED')}
        </CardText>
        <ActionBar>
          <Link to={`/${window?.contextPath}/employee`}>
            <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
          </Link>
        </ActionBar>
      </Card>
    )
  }

  if (mutation.isLoading || (mutation.isIdle && !mutationHappened)) {
    return <Loader />
  }


  const event = mutation?.data?.events?.[0] || successData?.events?.[0] || {};
  return (
    <Card>
      <BannerPicker
        t={t}
        message={mutation.isSuccess || successData ? `ENGAGEMENT_EVENT_CREATED_MESSAGE` : `ENGAGEMENT_EVENT_FAILED_MESSAGES`}
        data={mutation.data || successData}
        isSuccess={mutation.isSuccess || successData}
        isLoading={(mutation.isIdle && !mutationHappened) || mutation.isLoading}
      />
      <CardText>
        {mutation.isSuccess || successData ? t(`ENGAGEMENT_EVENT_CREATED_MESSAGES`, {
          eventName: event?.name,
          fromDate: Digit.DateUtils.ConvertTimestampToDate(event?.eventDetails?.fromDate),
          toDate: Digit.DateUtils.ConvertTimestampToDate(event?.eventDetails?.toDate),
          fromTime: mutation.isSuccess ? format(new Date(event?.eventDetails?.fromDate), 'HH:mm') : null,
          toTime: mutation.isSuccess ? format(new Date(event?.eventDetails?.toDate), 'HH:mm') : null,
        }) : null}
      </CardText>
      <ActionBar>
        <Link to={`/${window?.contextPath}/employee`}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </Card>
  )
}

export default Response;