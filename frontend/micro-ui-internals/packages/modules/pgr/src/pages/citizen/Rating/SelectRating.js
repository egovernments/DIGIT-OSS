import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RatingCard } from "@egovernments/digit-ui-react-components";
import { useParams, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { updateComplaints } from "../../../redux/actions/index";

const SelectRating = ({ parentRoute }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  console.log("jjjjjjjjjjjjjjjjj", parentRoute);

  let userType = Digit.SessionStorage.get("userType");
  let tenantId = userType == "CITIZEN" ? Digit.SessionStorage.get("Citizen.tenantId") : Digit.SessionStorage.get("Employee.tenantId");
  const complaintDetails = Digit.Hooks.pgr.useComplaintDetails({ tenantId: tenantId, id: id }).complaintDetails;
  const updateComplaint = useCallback((complaintDetails) => dispatch(updateComplaints(complaintDetails)), [dispatch]);

  function log(data) {
    if (complaintDetails) {
      console.log("complaintDetails", complaintDetails);
      complaintDetails.service.rating = data.rating;
      complaintDetails.service.additionalDetail = data.CS_FEEDBACK_WHAT_WAS_GOOD.join(",");
      complaintDetails.workflow = {
        action: "RATE",
        comments: data.comments,
        verificationDocuments: [],
      };
      console.log("updtaed complaint details", complaintDetails);
      updateComplaint({ service: complaintDetails.service, workflow: complaintDetails.workflow });

      return (
        <Redirect
          to={{
            pathname: `${parentRoute}/response`,
            state: { complaintDetails },
          }}
        />
      );
    }
  }

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
  return <RatingCard {...{ config: config }} t={t} onSelect={log} />;
};
export default SelectRating;
