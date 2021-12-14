import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

const BannerPicker = (props) => {
  const { t } = useTranslation();
  return (
    <Banner
      message={t(props.message)}
      applicationNumber={props?.data?.events?.[0]?.name}
      //info={t(`MESSAGE_ADD_SUCCESS_MESSAGE_MAIN`)}
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
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MSG_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MSG_MUTATION_SUCCESS_DATA", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_MSG_ERROR_DATA", false);



  useEffect(() => {
    if (updateEventMutation.data) setsuccessData(updateEventMutation.data);
  }, [updateEventMutation.data]);


  useEffect(() => {
    if (mutation.data) setsuccessData(mutation.data);
  }, [mutation.data]);

  const onError = (error, variables) => {
    setErrorInfo(error?.response?.data?.Errors[0]?.code || 'ERROR');
    setMutationHappened(true);
  };

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
    }
  }, []);

  if (searchParams?.delete || searchParams?.update) {
    if (updateEventMutation.isLoading || (updateEventMutation.isIdle && !mutationHappened)) {
      return <Loader />
    }
    return (
      <Card>
        <BannerPicker
          t={t}
          message={searchParams?.update ? (updateEventMutation.isSuccess || successData) ? 'ENGAGEMENT_PUBLIC_BRDCST_UPDATED' : 'ENG_PUBLIC_BRDCST_UPDATION_FAILED' : (updateEventMutation.isSuccess || successData) ? 'ENGAGEMENT_PUBLIC_BRDCST_DELETED' : 'ENGAGEMENT_PUBLIC_BRDCST_DELETION_FAILED'}
          data={updateEventMutation.data || successData}
          isSuccess={updateEventMutation?.isSuccess || successData}
          isLoading={(updateEventMutation.isIdle && !mutationHappened) || updateEventMutation.isLoading}
        />
        <CardText>
          {searchParams?.update ? t(`ENGAGEMENT_PUBLIC_BRDCST_MESSAGES`) : t(`ENGAGEMENT_PUBLIC_BRDCST_MESSAGES`)}
        </CardText>
        <ActionBar>
          <Link to={"/digit-ui/employee"}>
            <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
          </Link>
        </ActionBar>
      </Card>
    )
  }

  if (mutation.isLoading || (mutation.isIdle && !mutationHappened)) {
    return <Loader />
  }
  return (
    <Card>
      <BannerPicker
        t={t}
        message={mutation.isSuccess || successData ? `ENGAGEMENT_BROADCAST_MESSAGE_CREATED` : `ENGAGEMENT_BROADCAST_MESSAGE_FAILED`}
        data={mutation.data || successData}
        isSuccess={mutation.isSuccess || successData}
        isLoading={(mutation.isIdle && !mutationHappened) || mutation.isLoading}
      />
      <ActionBar>
        <Link to={"/digit-ui/employee"}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </Card>
  )
}

export default Response;