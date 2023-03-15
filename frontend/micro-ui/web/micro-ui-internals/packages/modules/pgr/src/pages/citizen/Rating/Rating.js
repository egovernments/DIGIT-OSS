import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Card, CardHeader, CardLabel, Rating, CheckBox, TextArea, SubmitBar } from "@egovernments/digit-ui-react-components";
import { updateComplaints } from "../../../redux/actions/index";

import { LOCALIZATION_KEY } from "../../../constants/Localization";
//import { Storage } from "../../@egovernments/digit-utils/services/Storage";

const RatingAndFeedBack = () => {
  const { id } = useParams();
  const { handleSubmit } = useForm();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [selection, setSelection] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  let complaintDetails = Digit.SessionStorage.get(`complaint.${id}`);

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
    complaintDetails.service.additionalDetail = selection;
    complaintDetails.workflow = {
      action: "RATE",
      comments: comment,
      verificationDocuments: [],
    };
    updateComplaint(complaintDetails);
  };

  const updateComplaint = useCallback((complaintDetails) => dispatch(updateComplaints(complaintDetails)), [dispatch]);

  let lables = ["_SERVICES", "_RESOLUTION_TIME", "_QUALITY_OF_WORK", "_OTHERS"];

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          {/* <CardHeader>Help Us Help You</CardHeader> */}
          <CardHeader>{t(`${LOCALIZATION_KEY.CS_COMPLAINT}_RATE_HELP_TEXT`)}</CardHeader>
          {/* <CardLabel>How would you rate your experience with us?</CardLabel> */}
          <CardLabel>{t(`${LOCALIZATION_KEY.CS_COMPLAINT}_RATE_TEXT`)}</CardLabel>
          <Rating currentRating={rating} maxRating={5} onFeedback={(e, ref, i) => feedback(e, ref, i)} />
          <CardLabel>{t(`${LOCALIZATION_KEY.CS_FEEDBACK}_WHAT_WAS_GOOD`)}</CardLabel>
          {lables.map((lable, index) => (
            <CheckBox key={index} onChange={onSelect} label={t(`${LOCALIZATION_KEY.CS_FEEDBACK}${lable}`)} />
          ))}
          <CardLabel>{t(`${LOCALIZATION_KEY.CS_COMMON}_COMMENTS`)}</CardLabel>
          <TextArea name="" onChange={onComments}></TextArea>
          <SubmitBar label={t(`${LOCALIZATION_KEY.CS_COMMON}_SUBMIT`)} />
        </Card>
      </form>
    </React.Fragment>
  );
};

export default RatingAndFeedBack;
