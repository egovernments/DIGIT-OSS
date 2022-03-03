import { Banner, Card, Loader, CardText, ActionBar, SubmitBar,Menu } from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import React, { useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import { Link,useHistory } from "react-router-dom";
const getMessage = (mutation) => {
  if (mutation.isSuccess) return mutation.data?.Surveys?.[0]?.uuid;
  return "";
};

const BannerPicker = (props) => {
  const { t } = useTranslation();
  return (
    <Banner
      message={props.mutation.isSuccess ? t(`SURVEY_FORM_CREATED`) : t("SURVEY_FORM_FAILURE")}
      applicationNumber={getMessage(props.mutation)}
      info={props.mutation.isSuccess ? t("SURVEY_FORM_ID") : ""}
      successful={props.mutation.isSuccess}
    />
  );
};

const Acknowledgement = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.survey.useCreate();
  const { state } = props.location;
  const history = useHistory();
  const [isActionClicked,setIsActionClicked] = useState(false) 
  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
      window.history.replaceState(null, 'CREATE_SURVEY_STATE')
    };
    if(!!state){
      mutation.mutate(state, {
        onSuccess,
      })
    };
  }, []);

  if (mutation.isLoading && !mutation.isIdle) {
    return <Loader />;
  }


  const survey = mutation.data?.Surveys?.[0];
 
  const handleActionClick = () => {
    setIsActionClicked((prevState => {
      return !prevState
    }))
  }
  // const actionClickHandler = (option) => {
  //   if(option === "Go Back to home") history.push("/digit-ui/employee")
  //   else if(option === "Create another survey") history.push("/digit-ui/employee/engagement/surveys/create")
  // }

   const actionClickHandler = (option) => {
    if(option === t("GO_BACK_TO_HOME")) history.push("/digit-ui/employee")
    else if(option === t("CREATE_ANOTHER_SURVEY")) history.push("/digit-ui/employee/engagement/surveys/create")
  }
  return (
    <Card>
      <BannerPicker
        t={t}
        mutation={mutation}
      />
      <CardText>
        {mutation.isSuccess 
          ? t(`SURVEY_FORM_CREATION_MESSAGE`, {
              surveyName: survey?.title,
              fromDate: Digit.DateUtils.ConvertTimestampToDate(survey?.startDate),
              toDate: Digit.DateUtils.ConvertTimestampToDate(survey?.endDate),
            })
          : null}
      </CardText>
      
       {/* <ActionBar>
        <Link to={"/digit-ui/employee"}>
          <SubmitBar label="Action" />
        </Link>
      </ActionBar> */}

      <ActionBar>
        <button onClick={handleActionClick}>
          <SubmitBar label="Action" />
          {/* {isActionClicked && <Menu options={["Go Back to home","Create another survey"]} onSelect={actionClickHandler}></Menu>} */}
          {isActionClicked && <Menu options={[t("GO_BACK_TO_HOME"),t("CREATE_ANOTHER_SURVEY")]} onSelect={actionClickHandler}></Menu>}
        </button>
      </ActionBar>
      

    </Card>
  );
};

export default Acknowledgement;