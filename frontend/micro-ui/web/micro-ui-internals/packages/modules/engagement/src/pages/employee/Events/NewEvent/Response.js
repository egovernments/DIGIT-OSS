import { Banner, Card, Loader, CardText, SubmitBar, ActionBar } from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


const BannerPicker = (props) => {
  const { t } = useTranslation();
  return (
    <Banner
      message={t(`ENGAGEMENT_EVENT_CREATED`)}
      applicationNumber={props?.data?.events?.[0]?.name}
      info={t(`ENGAGEMENT_EVENT_NAME`)}
      successful={props.isSuccess}
    />
  )
}

const Response = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.events.useCreateEvent();
  const { state } = props.location;

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
    }
    mutation.mutate(state, {
      onSuccess
    })
  }, []);

  if (mutation.isLoading || mutation.isIdle) {
    return <Loader />
  }
  return (
    <Card>
      <BannerPicker
        t={t}
        data={mutation.data}
        isSuccess={mutation.isSuccess}
        isLoading={mutation.isIdle || mutation.isLoading}
      />
      <CardText>{t(`ENGAGEMENT_EVENT_CREATED_MESSAGES`, {
        eventName: mutation?.data?.events?.[0]?.name,
        fromDate: Digit.DateUtils.ConvertTimestampToDate(mutation?.data?.events?.[0]?.eventDetails?.fromDate),
        toDate: Digit.DateUtils.ConvertTimestampToDate(mutation?.data?.events?.[0]?.eventDetails?.toDate),
        fromTime: (new Date(mutation?.data?.events?.[0]?.eventDetails?.fromDate*1000)+'').slice(17,22),
        toTime: (new Date(mutation?.data?.events?.[0]?.eventDetails?.toDate*1000)+'').slice(17,22),
      })}
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