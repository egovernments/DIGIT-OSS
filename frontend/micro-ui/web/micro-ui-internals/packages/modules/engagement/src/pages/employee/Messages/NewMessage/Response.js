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
          message={searchParams?.update ? 'ENGAGEMENT_PUBLIC_BRDCST_UPDATED' : 'ENGAGEMENT_PUBLIC_BRDCST_DELETED'}
          data={updateEventMutation.data}
          isSuccess={updateEventMutation.isSuccess}
          isLoading={updateEventMutation.isIdle || updateEventMutation.isLoading}
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

  if (mutation.isLoading || mutation.isIdle) {
    return <Loader />
  }
  return (
    <Card>
      <BannerPicker
        t={t}
        message={`ENGAGEMENT_BROADCAST_MESSAGE_CREATED`}
        data={mutation.data}
        isSuccess={mutation.isSuccess}
        isLoading={mutation.isIdle || mutation.isLoading}
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