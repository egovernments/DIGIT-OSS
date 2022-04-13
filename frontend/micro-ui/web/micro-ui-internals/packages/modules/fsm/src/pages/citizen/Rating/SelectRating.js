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

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

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

  const handleSelect = (type, key) => {
    if (type === "DROP_DOWN") {
      return (value) => {
        setAnswers({ ...answers, [key]: value.code });
      };
    }
    return (value) => {
      setAnswers({ ...answers, [key]: value });
    };
  };

  if (isLoading) {
    return <Loader />;
  }

  const getType = (type) => {
    switch (type) {
      case "SINGLE_SELECT":
        return "radio";
      case "MULTI_SELECT":
        return "checkbox";
      case "DROP_DOWN":
        return "dropDown";
      default:
        return "checkbox";
    }
  }

  const getOption = (type, options) => {
    if (type === "DROP_DOWN") {
      let option = []
      options.map((data) => {
        option.push({
          active: true,
          citizenOnly: false,
          code: data,
          i18nKey: data,
          name: data
        })
      })
      return option
    } else {
      return options
    }
  }

  const getSelectedOption = (type, code, options) => {
    switch (type) {
      case "SINGLE_SELECT":
        return answers[code];
      case "DROP_DOWN":
        return options.find((element) => element.code === answers[code]);
      default:
        return null;
    }
  }

  const inputs = checklistData?.FSM?.CheckList.map((item) => ({
    type: getType(item.type),
    checkLabels: getOption(item.type, item.options),
    onSelect: item.type === "SINGLE_SELECT" || item.type === "DROP_DOWN" ? handleSelect(item.type, item.code) : null,
    selectedOption: getSelectedOption(item.type, item.code, getOption(item.type, item.options)),
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
