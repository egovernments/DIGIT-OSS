import { Header, Modal, Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { format } from "date-fns";
import EditSurveyForm from "../../../components/Surveys/EditSurveyForms";
import { mapQuestions } from "./NewSurvey";
import DeleteModal from "../../../components/Modal/Surveys/Delete";
import MarkActiveModal from "../../../components/Modal/Surveys/MarkActive";
import MarkInActiveModal from "../../../components/Modal/Surveys/MarkInActive";
import { answerTypeEnum } from "./NewSurvey";

/**Putting this fix becasue backend doesn't how to define optional fields in Models
 * tldr; remove `options:["NA"] for open ended questions which gets added by BE`
 */
const filterQuestion = (question) => {
  if (!question) return;
  // if (question.type !== "Multiple Choice" || question.type !== "Check Boxes") {
  //   delete question.options;
  // }
  return { ...question, type: question.type.includes("_") ? question.type : answerTypeEnum[question.type],options:question?.options, status:question.status ? question.status : "ACTIVE", qorder:question.qorder };
};

/**TODO : Think of better to do this possibly in service layer */
const TypeAnswerEnum = {
  SHORT_ANSWER_TYPE: "Short Answer",
  LONG_ANSWER_TYPE: "Paragraph",
  MULTIPLE_ANSWER_TYPE: "Multiple Choice",
  CHECKBOX_ANSWER_TYPE: "Check Boxes",
  DATE_ANSWER_TYPE: "Date",
  TIME_ANSWER_TYPE: "Time",
};

const SurveyDetails = ({ location, match }) => {
  let isMobile = window.Digit.Utils.browser.isMobile();
  const { id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isFormPartiallyEnabled, setFormPartiallyEnabled] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [userAction, setUserAction] = useState(undefined);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenantIdForInboxSearch = window?.Digit.SessionStorage?.get("CITIZENSURVEY.INBOX")?.searchForm?.tenantIds?.code || tenantId
  const [showToast, setShowToast] = useState(null);

  const closeToast = () => {
    setShowToast(null);
  };
  setTimeout(() => {
    closeToast();
  }, 10000);

  function convertTime12To24(time) {
    var hours   = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM    = time.match(/\s(.*)$/)[1];
    if (AMPM === "PM" || AMPM === "pm"  && hours < 12) hours = hours + 12;
    if (AMPM === "AM" || AMPM === "am" && hours === 12) hours = hours - 12;
    var sHours   = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes);
}

  const { isLoading, data: surveyData } = Digit.Hooks.survey.useSearch(
    { tenantIds: tenantIdForInboxSearch, uuid: id },
    {
      select: (data) => {
        const surveyObj = data?.Surveys?.[0];
        return {
          //tenantIds: { code: surveyObj.tenantId },
          uuid: surveyObj.uuid,
          title: surveyObj.title,
          description: surveyObj.description,
          fromDate: format(new Date(surveyObj.startDate), "yyyy-MM-dd"),
          toDate: format(new Date(surveyObj.endDate), "yyyy-MM-dd"),
          fromTime: convertTime12To24(new Date(surveyObj.startDate).toLocaleString("en-IN",{hour: "numeric", minute:"numeric",hour12:true})),
          toTime: convertTime12To24(new Date(surveyObj.endDate).toLocaleString("en-IN",{hour: "numeric", minute:"numeric",hour12:true})),
          questions: surveyObj.questions.map(({ questionStatement, type, required, options, uuid, surveyId, qorder, status }) => ({
            questionStatement,
            type: /*TypeAnswerEnum[type]*/type,
            required,
            options,
            uuid,
            surveyId,
            qorder,
            status
          })),
          status: surveyObj.status,
          tenantId: { code: surveyObj.tenantId },
        };
      },
    }
  );

  const isSurveyActive = useMemo(() => {
    const surveyStartTime = new Date(`${surveyData?.fromDate} ${surveyData?.fromTime}`).getTime();
    const surveyEndTime = new Date(`${surveyData?.toDate} ${surveyData?.toTime}`).getTime();
    const currentTime = new Date().getTime();
    if (surveyStartTime < currentTime && currentTime < surveyEndTime) {
      return true;
    }
    return false;
  }, [surveyData?.fromDate, surveyData?.fromTime, surveyData?.toDate, surveyData?.toTime]);

  function onActionSelect(action) {
    if (action === "EDIT") {
      if (isSurveyActive) {
        setFormPartiallyEnabled(!isFormPartiallyEnabled);
      } else {
        setIsFormDisabled(!isFormDisabled);
      }
      setUserAction("EDIT");
    }
    if (action === "INACTIVE") {
      setShowModal(true);
      setUserAction("INACTIVE");
    }
    if (action === "ACTIVE") {
      setShowModal(true);
      setUserAction("ACTIVE");
    }
    if (action === "DELETE") {
      setShowModal(true);
      setUserAction("DELETE");
    }
    setDisplayMenu(false);
  }

  const onEdit = (data) => {
    const { collectCitizenInfo, title, description, tenantIds, fromDate, toDate, fromTime, toTime, questions } = data;
    const mappedQuestions = mapQuestions(questions,surveyData);
    const details = {
      SurveyEntity: {
        uuid: surveyData.uuid,
        //tenantIds: tenantIds.map(({ code }) => code),
        tenantId: tenantIds[0]?.code ? tenantIds[0]?.code : surveyData.tenantId.code,
        title,
        description,
        startDate: new Date(`${fromDate} ${fromTime}`).getTime(),
        endDate: new Date(`${toDate} ${toTime}`).getTime(),
        questions: mappedQuestions,
        status:isSurveyActive?"ACTIVE":"INACTIVE",
        // active:true,
        // answersCount:0,
        // postedBy:"BPAREG Approver",
        //lastmodifiedby:"BPAREG Approver",
        //lastmodifiedtime:"1645074240234"
        //These are not required to update, only status was required that we were not sending..
      },
    };

    try{
      let filters = {tenantIds : tenantIds[0]?.code ? tenantIds[0]?.code : surveyData.tenantId.code, title : title}
      Digit.Surveys.search(filters).then((ob) => {
        if(ob?.Surveys?.length>0 && data?.title !== surveyData?.title)
        {
          setShowToast({ key: true, label: "SURVEY_SAME_NAME_SURVEY_ALREADY_PRESENT" });
        }
        else
        {
          history.push("/digit-ui/employee/engagement/surveys/update-response", details);
        }
      })
    }
    catch(error)
    {}
  };

  const handleDelete = () => {
    const details = {
      SurveyEntity: { ...surveyData, tenantId: tenantId?.code ? tenantId?.code : tenantId },
    };
    history.push("/digit-ui/employee/engagement/surveys/delete-response", details);
  };

  //if we don't send tenantId it violates the not null constraint in the backend...
  const handleMarkActive = (data) => {
    const { fromDate, toDate, fromTime, toTime } = data;
    const details = {
      SurveyEntity: {
        ...surveyData,
        status: "ACTIVE",
        startDate: new Date(`${fromDate} ${fromTime}`).getTime(),
        endDate: new Date(`${toDate} ${toTime}`).getTime(),
        questions: surveyData.questions.map(filterQuestion),
        tenantId,
      },
    };
    history.push("/digit-ui/employee/engagement/surveys/update-response", details);
  };

  const handleMarkInactive = () => {
    const details = {
      SurveyEntity: { ...surveyData,
        tenantId,
        questions: surveyData.questions.map(filterQuestion), 
        status: "INACTIVE", 
         },
    };
    history.push("/digit-ui/employee/engagement/surveys/update-response", details);
  };

  const actionMenuOptions = useMemo(() => {
    const options = ["EDIT", "DELETE"];
    if (isSurveyActive && surveyData?.status === "ACTIVE") {
      options.splice(1, 0, "INACTIVE");
    } else if (!isSurveyActive) {
      options.splice(1, 0, "ACTIVE");
    }
    return options;
  }, [isSurveyActive, surveyData?.status]);

  if (isLoading) return <Loader />;


  return (
    <Fragment>
      <Header>{t("CS_COMMON_SURVEYS")}</Header>
      <EditSurveyForm
        t={t}
        onEdit={onEdit}
        menuOptions={actionMenuOptions}
        displayMenu={displayMenu}
        isFormDisabled={isFormDisabled}
        isPartiallyEnabled={isFormPartiallyEnabled}
        setDisplayMenu={setDisplayMenu}
        onActionSelect={onActionSelect}
        initialSurveysConfig={surveyData}
        isSurveyActive = {isSurveyActive}
        formDisabled={isFormDisabled}
      />

      {showModal && userAction === "DELETE" && (
        <DeleteModal
          t={t}
          heading={"CONFIRM_DELETE_SURVEY"}
          surveyTitle={surveyData.title}
          closeModal={() => setShowModal(false)}
          actionCancelLabel={"CS_COMMON_CANCEL"}
          actionCancelOnSubmit={() => setShowModal(false)}
          actionSaveLabel={"ES_COMMON_DEL"}
          actionSaveOnSubmit={handleDelete}
        />
      )}
      {showModal && userAction === "ACTIVE" && (
        <MarkActiveModal
          t={t}
          heading={"CONFIRM_MARKACTIVE_SURVEY"}
          initialValues={surveyData}
          closeModal={() => setShowModal(false)}
          actionCancelLabel={"CS_COMMON_CANCEL"}
          actionCancelOnSubmit={() => setShowModal(false)}
          actionSaveLabel={"ES_COMMON_SAVE"}
          actionSaveOnSubmit={handleMarkActive}
          onSubmit={handleMarkActive}
          surveyTitle={surveyData.title}
        />
      )}
      {/* CONFIRM_MARKINACTIVE_SURVEY - key for heading in modal */}
      {showModal && userAction === "INACTIVE" && (
        <MarkInActiveModal
          t={t}
          heading={"CONFIRM_MARKINACTIVE_SURVEY"}
          surveyTitle={surveyData.title}
          closeModal={() => setShowModal(false)}
          actionCancelLabel={"CS_COMMON_CANCEL"}
          actionCancelOnSubmit={() => setShowModal(false)}
          actionSaveLabel={"ES_COMMON_Y_MARKINACTIVE"}
          actionSaveOnSubmit={handleMarkInactive}
        />
      )}
      {showToast && <Toast error={showToast.key} label={t(showToast.label)} onClose={closeToast} />}
    </Fragment>
  );
};

export default SurveyDetails;