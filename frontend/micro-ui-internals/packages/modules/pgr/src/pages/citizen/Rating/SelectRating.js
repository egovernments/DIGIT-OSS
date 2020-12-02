import React from "react";
import { RatingCard } from "@egovernments/digit-ui-react-components";

const SelectRating = () => {
  const config = {
    texts: {
      header: "CS_COMPLAINT_RATE_HELP_TEXT",
      submitBarLabel: "PT_COMMONS_NEXT",
    },
    inputs: [
      {
        type: "rate",
        maxRating: 5,
        label: "CS_COMPLAINT_RATE_TEXT",
      },
      {
        type: "checkbox",
        label: "CS_FEEDBACK_WHAT_WAS_GOOD",
        checkLabels: ["CS_FEEDBACK_SERVICES", "CS_FEEDBACK_RESOLUTION_TIME", "CS_FEEDBACK_QUALITY_OF_WORK", "CS_FEEDBACK_OTHERS"],
      },
      {
        type: "textarea",
        label: "CS_COMMON_COMMENTS",
        name: "comments",
      },
    ],
  };
  return <RatingCard {...{ config: config }} />;
};
export default SelectRating;
