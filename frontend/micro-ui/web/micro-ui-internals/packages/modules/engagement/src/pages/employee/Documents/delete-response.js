import { Banner, Card, Loader, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const getMessage = (mutation) => {
  if (mutation.isSuccess) return mutation.data?.Documents?.uuid;
  return "";
};

const BannerPicker = (props) => {
  const { t } = useTranslation();
  return (
    <Banner
      message={props.isSuccess ? t(`ENGAGEMENT_DOC_DELETED`) : t("ENGAGEMENT_DOC_DELETE_FAILURE")}
      applicationNumber={props.mutation?.isSuccess ? props.uuid : ''}
      info={props.isSuccess ? t("ENGAGEMENT_DOCUMENT_ID") : ""}
      successful={props.isSuccess}
    />
  );
};

const Response = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.engagement.useDocDelete();
  const { state } = props.location;

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
    };

    mutation.mutate(state, {
      onSuccess,
    });
  }, []);

  if (mutation.isLoading || mutation.isIdle) {
    return <Loader />;
  }

  return (
    <div>
      <Card>
        <BannerPicker t={t} data={mutation.data} mutation={mutation} uuid={state?.DocumentEntity?.uuid} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      </Card>
      <ActionBar>
        <Link to={"/digit-ui/employee"}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </div>
  );
};

export default Response;
