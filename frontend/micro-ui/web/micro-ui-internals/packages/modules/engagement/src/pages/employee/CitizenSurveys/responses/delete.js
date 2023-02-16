import { Banner, Card, Loader, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// const getMessage = (mutation) => {
//   if (mutation.isSuccess) return mutation.data?.Documents?.uuid;
//   return "";
// };
// const getMessage = (mutation) => {

//   if (mutation.isSuccess && mutation?.data?.Surveys?.[0]?.uuid) {
//     return mutation?.data?.Surveys?.[0]?.uuid
//   }
//   if (mutation.isSuccess) return mutation.data?.Documents?.[0]?.uuid;
//   return "";
// };


const BannerPicker = (props) => {
  const { t } = useTranslation();
  return (
    <Banner
      message={props.isSuccess ? t(`ENGAGEMENT_SURVEY_DELETED`) : t("ENGAGEMENT_SURVEY_DELETE_FAILURE")}
      //applicationNumber={getMessage(props.mutation)}
      //info={props.isSuccess ? t("SURVEY_FORM_ID") : ""}
      successful={props.isSuccess}
    />
  );
};

const Response = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.survey.useDelete();
  const { state } = props.location;

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
      window.history.replaceState(null, 'DELETE_SURVEY_STATE')
    };
    if(!!state){
      mutation.mutate(state, {
        onSuccess,
      });
    }
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
