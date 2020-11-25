import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Card, CardHeader, CardLabel, Rating, CheckBox, TextArea, SubmitBar } from "@egovernments/digit-ui-react-components";
import { updateComplaints } from "../../../redux/actions/index";
//import { Storage } from "../../@egovernments/digit-utils/services/Storage";
import { useTranslation } from "react-i18next";

const RatingAndFeedBack = () => {
  const { id } = useParams();
  const { handleSubmit } = useForm();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [selection, setSelection] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const onSelect = (e) => {
    setSelection([...selection, e.target.value]);
  };

  const onComments = (e) => {
    setComment(e.target.value);
  };

  const feedback = (e, ref, index) => {
    setRating(index);
  };

  const onSubmit = () => {
    let complaintDetails = Digit.SessionStorage.get(`complaint.${id}`);
    complaintDetails.service.rating = rating;
    complaintDetails.workflow = {
      action: "RATE",
      comments: comment,
      verificationDocuments: [],
    };
    updateComplaint(complaintDetails);
  };

  const updateComplaint = useCallback((complaintDetails) => dispatch(updateComplaints(complaintDetails)), [dispatch]);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          {/* <CardHeader>Help Us Help You</CardHeader> */}
          <CardHeader>{t("CS_COMPLAINT_RATE_HELP_TEXT")}</CardHeader>
          {/* <CardLabel>How would you rate your experience with us?</CardLabel> */}
          <CardLabel>{t("CS_COMPLAINT_RATE_TEXT")}</CardLabel>
          <Rating currentRating={rating} maxRating={5} onFeedback={(e, ref, i) => feedback(e, ref, i)} />
          <CardLabel>{t("CS_FEEDBACK_WHAT_WAS_GOOD")}</CardLabel>
          <CheckBox onChange={onSelect} label={t("CS_FEEDBACK_SERVICES")} />
          <CheckBox onChange={onSelect} label={t("CS_FEEDBACK_RESOLUTION_TIME")} />
          <CheckBox onChange={onSelect} label={t("CS_FEEDBACK_QUALITY_OF_WORK")} />
          <CheckBox onChange={onSelect} label={t("CS_FEEDBACK_OTHERS")} />
          <CardLabel>{t("CS_COMMON_COMMENTS")}</CardLabel>
          <TextArea onChange={onComments}></TextArea>
          <SubmitBar label={t("CS_COMMON_SUBMIT")} />
        </Card>
      </form>
    </React.Fragment>
  );
};

export default RatingAndFeedBack;
