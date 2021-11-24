import { Header, Modal, Loader } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { format } from "date-fns";

import EditSurveyForm from "../../../components/Surveys/EditSurveyForms";

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const SurveyDetails = ({ location, match }) => {
  let isMobile = window.Digit.Utils.browser.isMobile();
  const { id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [userAction, setUserAction] = useState(undefined);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, data: surveyData } = Digit.Hooks.survey.useSearch(
    { tenantIds: tenantId, uuid: id },
    {
      select: (data) => {
        const surveyObj = data?.Surveys?.[0];
        return {
          //tenantIds: { code: surveyObj.tenantId },
          title: surveyObj.title,
          description: surveyObj.description,
          collectCitizenInfo: { code: surveyObj.collectCitizenInfo },
          fromDate: format(new Date(surveyObj.startDate), "yyyy-MM-dd"),
          toDate: format(new Date(surveyObj.endDate), "yyyy-MM-dd"),
          fromTime: format(new Date(surveyObj.startDate), "hh:mm"),
          toTime: format(new Date(surveyObj.endDate), "hh:mm"),
          questions: surveyObj.questions.map(({questionStatement, type, required, options})=>({questionStatement, type, required, options})),
        };
      },
    }
  );

  function onActionSelect(action) {
    // setSelectedAction(action);
    if (action === "EDIT") {
      //make form editable
      setIsFormDisabled(!isFormDisabled)
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
  console.log("surveyData", { surveyData });
  const onEdit = (data) => {
    //console.log("<<data>>", { data });
  };

  const handleDelete = () => {
    const details = {
      SurveyEntity: surveyData,
    };
    history.push("/digit-ui/employee/engagement/surveys/delete-response", details);
  };

  if (isLoading) return <Loader />;

  return (
    <Fragment>
      <Header>{t("CS_COMMON_SURVEYS")}</Header>
      <EditSurveyForm
        t={t}
        onEdit={onEdit}
        displayMenu={displayMenu}
        isFormDisabled={isFormDisabled}
        setDisplayMenu={setDisplayMenu}
        onActionSelect={onActionSelect}
        initialSurveysConfig={surveyData}
      />

      {showModal && (
        <Modal
          headerBarMain={<Heading label={t("ES_EVENT_DELETE_POPUP_HEADER")} />}
          headerBarEnd={<CloseBtn onClick={() => setShowModal(false)} />}
          actionCancelLabel={t("CS_COMMON_CANCEL")}
          actionCancelOnSubmit={() => setShowModal(false)}
          actionSaveLabel={t("ES_EVENT_DELETE")}
          actionSaveOnSubmit={handleDelete}
        >
          <Card style={{ boxShadow: "none" }}>
            <CardText>{t(`ES_EVENT_DELETE_TEXT`)}</CardText>
          </Card>
        </Modal>
      )}
    </Fragment>
  );
};

export default SurveyDetails;
