import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { RatingCard } from "@egovernments/digit-ui-react-components";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { updateComplaints } from "../../../redux/actions/index";

const SelectRating = ({ parentRoute }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  // console.log("parent route", parentRoute);
  const history = useHistory();

  let tenantId = Digit.ULBService.getCurrentTenantId();
  const complaintDetails = Digit.Hooks.pgr.useComplaintDetails({ tenantId: tenantId, id: id }).complaintDetails;
  const updateComplaint = useCallback((complaintDetails) => dispatch(updateComplaints(complaintDetails)), [dispatch]);

  function log(data) {
    if (complaintDetails) {
      complaintDetails.service.rating = data.rating;
      complaintDetails.service.additionalDetail = data.CS_FEEDBACK_WHAT_WAS_GOOD.join(",");
      complaintDetails.workflow = {
        action: "RATE",
        comments: data.comments,
        verificationDocuments: [],
      };
      // console.log("updtaed complaint details", complaintDetails);
      updateComplaint({ service: complaintDetails.service, workflow: complaintDetails.workflow });
      history.push(`${parentRoute}/response`);
    }
  }

  const config = {
    texts: {
      header: "CS_COMPLAINT_RATE_HELP_TEXT",
      submitBarLabel: "CS_COMMONS_NEXT",
    },
    inputs: [
      {
        type: "rate",
        maxRating: 5,
        label: t("CS_COMPLAINT_RATE_TEXT"),
      },
      {
        type: "checkbox",
        label: "CS_FEEDBACK_WHAT_WAS_GOOD",
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
