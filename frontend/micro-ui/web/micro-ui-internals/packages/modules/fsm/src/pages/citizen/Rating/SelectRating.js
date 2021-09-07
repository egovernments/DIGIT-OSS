import React, { useEffect, useState } from "react";
import { Loader, RatingCard } from "@egovernments/digit-ui-react-components";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SelectRating = ({ parentRoute }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  let { id: applicationNos } = useParams();
  const { isError, error, data: application } = Digit.Hooks.fsm.useSearch(tenantId, { applicationNos });
  const { isLoading, data: checklistData } = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "Checklist");
  const mutation = Digit.Hooks.fsm.useApplicationUpdate(tenantId);
  const [answers, setAnswers] = useState({});

  function handleSubmit(data) {
    const { rating, comments } = data;
    const allAnswers = { ...data, ...answers };
    let checklist = Object.keys(allAnswers).reduce((acc, key) => {
      if (key === "comments" || key === "rating") {
        return acc;
      }
      acc.push({ code: key, value: Array.isArray(allAnswers[key]) ? allAnswers[key].join(",") : allAnswers[key] });
      return acc;
    }, []);

    application.additionalDetails = {
      CheckList: checklist,
    };

    history.push(`${parentRoute}/response`, {
      applicationData: application,
      key: "update",
      action: "RATE",
      actionData: { rating, comments },
    });
  }

  const handleSelect = (key) => {
    return (value) => {
      setAnswers({ ...answers, [key]: value });
    };
  };

  if (isLoading) {
    return <Loader />;
  }

  const inputs = checklistData?.FSM?.CheckList.map((item) => ({
    type: item.type === "SINGLE_SELECT" ? "radio" : "checkbox",
    checkLabels: item.options,
    onSelect: item.type === "SINGLE_SELECT" ? handleSelect(item.code) : null,
    selectedOption: item.type === "SINGLE_SELECT" ? answers[item.code] : null,
    name: item.code,
    label: item.code === "SPILLAGE" ? t("CS_FSM_APPLICATION_RATE_HELP_TEXT") : item.code,
  }));

  const config = {
    texts: {
      header: t("CS_FSM_APPLICATION_RATE_TEXT"),
      submitBarLabel: t("CS_COMMON_SUBMIT"),
    },
    inputs: [
      {
        type: "rate",
        maxRating: 5,
      },
      ...inputs,
      {
        type: "textarea",
        label: t("CS_COMMON_COMMENTS"),
        name: "comments",
      },
    ],
  };
  return <RatingCard config={config} t={t} onSelect={handleSubmit} />;
};
export default SelectRating;
