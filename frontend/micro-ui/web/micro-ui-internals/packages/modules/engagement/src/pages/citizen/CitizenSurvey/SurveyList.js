import { Clock, Header, Loader, WhatsNewCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import SurveyListCard from "../../../components/Surveys/SurveyListCard";
const isActive = (startDate, endDate) => {
  const currentDate = new Date().getTime();
  if (startDate < currentDate && currentDate <= endDate) {
    return true;
  }
  return false;
};

const SurveyList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantIds = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
  const { data, isLoading: isLoadingSurveys } = Digit.Hooks.survey.useSearch(
    { tenantIds },
    {
      select: ({ Surveys }) => {
        const allSurveys = Surveys.map((survey) => ({ hasResponded: false, responseStatus: "CS_SURVEY_YT_TO_RESPOND", ...survey }));
        const activeSurveysList = [];
        const inactiveSurveysList = [];
        for (let survey of allSurveys) {
          if (survey.status === "ACTIVE" && isActive(survey.startDate, survey.endDate)) {
            activeSurveysList.push(survey);
          } else {
            inactiveSurveysList.push(survey);
          }
        }
        return {
          activeSurveysList,
          inactiveSurveysList,
        };
      },
    }
  );

  const handleCardClick = (details) => {
    history.push("/digit-ui/citizen/engagement/surveys/fill-survey", details);
  };

  if (isLoadingSurveys) {
    return <Loader />;
  }

  return (
    <div>
      <Header>{`${t("CS_COMMON_SURVEYS")} (${data?.activeSurveysList.length})`}</Header>

      {data?.activeSurveysList && data.activeSurveysList.length ? (
        data.activeSurveysList.map((data, index) => {
          return (
            <div className="surveyListCardMargin">
              <SurveyListCard
                header={data.title}
                about={data.description}
                activeTime={data.endDate}
                postedAt={data.auditDetails.createdTime}
                responseStatus={data.responseStatus}
                hasResponsed={data.status}
                key={index}
                onCardClick={() => handleCardClick(data)}
              />
            </div>
          );
        })
      ) : (
        <div className="centered-message">
          <p>{t("CS_NO_ACTIVE_SURVEYS")}</p>
        </div>
      )}

      <Header>{`${t("CS_COMMON_INACTIVE_SURVEYS")} (${data.inactiveSurveysList.length})`}</Header>

      {data?.inactiveSurveysList && data.inactiveSurveysList.length ? (
        data.inactiveSurveysList.map((data, index) => {
          return (
            <div className="surveyListCardMargin">
              <SurveyListCard
                header={data.title}
                about={data.description}
                activeTime={data.endDate}
                postedAt={data.auditDetails.createdTime}
                responseStatus={data.responseStatus}
                hasResponsed={data.status}
                key={index}
              />
            </div>
          );
        })
      ) : (
        <div className="centered-message">
          <p>{t(`CS_NO_INACTIVE_SURVEYS`)}</p>
        </div>
      )}
    </div>
  );
};

export default SurveyList;
