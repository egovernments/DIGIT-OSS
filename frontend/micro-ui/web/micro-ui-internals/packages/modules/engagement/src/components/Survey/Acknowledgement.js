import { Banner, Card, Loader, CardText } from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const getMessage = (mutation) => {
  if (mutation.isSuccess) return mutation.data?.Documents?.[0]?.uuid;
  return "";
};

const BannerPicker = (props) => {
  const { t } = useTranslation();
  return (
    <Banner
      message={props.isSuccess ? t(`SURVEY_FORM_CREATED`) : t("SURVEY_FORM_FAILURE")}
      applicationNumber={getMessage(props.mutation)}
      info={props.isSuccess ? t("SURVEY_FORM_ID") : ""}
      successful={props.isSuccess}
    />
  );
};

const Acknowledgement = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  //const mutation = Digit.Hooks.engagement.useSurveyCreate();
  const { state } = props.location;

 

 /*  
    if(mutation.isIdle){
        mutation.mutate(state,{
            onSuccess
        })
    }

 if (mutation.isLoading || ) {
    return <Loader />;
  } */

  return (
    <Card>
      <BannerPicker t={t} data={mutation.data} 
      //mutation={mutation} 
      isSuccess={mutation.isSuccess} 
      //isLoading={mutation.isIdle || mutation.isLoading} 
      />
    </Card>
  );
};

export default Acknowledgement;
