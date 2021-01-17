import React from "react";
import { RatingCard } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SelectRating = ({ parentRoute }) => {
  const { t } = useTranslation();
  const history = useHistory();
  console.log("parent route", parentRoute);

  function log(data) {
    history.push(`${parentRoute}/response`);
  }

  const config = {
    texts: {
      header: "CS_COMPLAINT_RATE_HELP_TEXT",
      submitBarLabel: "SUBMIT",
    },
    inputs: [
      {
        type: "rate",
        maxRating: 5,
        label: t("CS_COMPLAINT_RATE_TEXT"),
      },
      {
        type: "checkbox",
        label: t("CS_FEEDBACK_WHAT_WAS_GOOD"),
        checkLabels: [t("CS_FEEDBACK_SERVICES"), t("CS_FEEDBACK_RESOLUTION_TIME"), t("CS_FEEDBACK_QUALITY_OF_WORK"), t("CS_FEEDBACK_OTHERS")],
      },
      {
        type: "textarea",
        label: t("CS_COMMON_COMMENTS"),
        name: "comments",
      },
    ],
  };
  return <RatingCard {...{ config: config }} t={t} onSelect={log} />;
};
export default SelectRating;
