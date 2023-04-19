import React, { useCallback, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RatingAndFeedBack } from "../config/RatingAndFeedback";

import { Card, CardHeader, CardLabel, CheckBox, TextArea, SubmitBar, Rating, CloseSvg, Loader, CardText, CardLabelError } from "@egovernments/digit-ui-react-components";

const CitizenFeedback = ({popup = false, onClose, setShowToast, data}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = Digit.UserService.getUser();
  let {redirectedFrom, propertyId, acknowldgementNumber, creationReason, tenantId, locality} = Digit.Hooks.useQueryParams();
  const isMobile = window.Digit.Utils.browser.isMobile();
  tenantId = tenantId || Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  //uncomment this once mdms updated in QA
  const { data: RatingAndFeedBack, isLoading: RatingAndFeedBackLoading } = Digit.Hooks.pt.useRatingAndFeedbackMDMS.RatingAndFeedBack(stateId);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  //uncomment this once mdms updated in QA
  if (RatingAndFeedBackLoading) {
    return <Loader />;
  }

  const onComments = (e) => {
    setComment(e.target.value);
  };

  const feedback = (e, ref, index) => {
    setRating(index);
  };

  const onSubmit = () => {

    let formData = {}

    let ServiceDefinitionCriteria =  {
        "tenantId": data?.Properties?.[0]?.tenantId || tenantId,
        "code": [`PT_${redirectedFrom?.includes("payment") ? "PAYMENT" : (creationReason || data?.Properties?.[0]?.creationReason)}`],
        "module": ["PT"]
    }

    Digit.PTService.cfdefinitionsearch({filters : {ServiceDefinitionCriteria}}).then((result1, err) => {

    if(result1?.ServiceDefinition?.length > 0){
        formData = {
                "tenantId": data?.Properties?.[0]?.tenantId || tenantId,
                "serviceDefId": result1?.ServiceDefinition?.[0]?.id,
                "isActive": true,
                "attributes": [
                    {
                        "attributeCode": "consumerCode",
                        "value": propertyId || data?.Properties?.[0]?.propertyId,
                        "additionalDetails": {}
                    },
                    {
                        "attributeCode": "rating",
                        "value": rating,
                        "additionalDetails": {}
                    },
                    {
                        "attributeCode": "comments",
                        "value": comment,
                        "additionalDetails": {}
                    },
                    {
                        "attributeCode": "channel",
                        "value": "Online",
                        "additionalDetails": {}
                    }
                ],
                "additionalDetails": {
                  locality: locality || data?.Properties?.[0]?.address?.locality?.code || "",
                },
                "accountId" : user?.info?.uuid,
                //"clientId": result1?.ServiceDefinition?.[0]?.clientId
        }

    //condition for create formdata according to bussiness service
    formData = {...formData, referenceId : acknowldgementNumber || data?.Properties?.[0]?.acknowldgementNumber}
    

    Digit.PTService.cfcreate({ Service: {...formData} }, tenantId)
      .then((result, err) => {
        if(result?.Service?.length > 0){ 
            if(popup)
            {   onClose(false);
                setShowToast({ key: false, label: "PT_FEEDBACK_SUBMITTED_SUCCESSFULLY" });
            }
            else
            history.push({pathname:"/digit-ui/citizen/feedback-acknowledgement",
                state: {rating,comment,result}})

        }
      })
      .catch((e) => {
        setShowToast({ key: "error", label:`${e?.response?.data?.Errors[0]?.message}` });
        //setError(e?.response?.data?.Errors[0]?.message || null);
      });
    }
    }) 

  };


  const getCardHeaderAndText = (type) => {
    //this is used if need to show default card text and header in pop up : removing the same for now
    // if(type === "Header" && popup)
    // return "PT_RATE_HELP_TEXT";
    // else if(type === "Text" && popup)
    // return "PT_RATE_TEXT";
    let tempObject = RatingAndFeedBack?.enabledScreensList?.filter((ob) => ob?.module === "PT" && (redirectedFrom?.includes(ob?.screenfrom) || ob?.bussinessService?.includes(data?.Properties?.[0]?.creationReason)))?.[0] 
    if(type === "Header")
    return tempObject?.cardHeader;
    else if(type === "Text")
    {
      return tempObject?.cardText;
    }
  }

  const getCommentHeader = () => {
    return RatingAndFeedBack?.headerByRating?.filter((ob) => rating >= ob?.minvalue && rating <= ob?.maxvalue)?.[0]?.code || t("CS_WHAT_WENT_WRONG");
  }

  const getCommentCheck = () => {
    if(comment && comment?.length < 64)
    return true;
    else if(rating)
    return false;
    else
    return true;
  }

  return (
    <React.Fragment>
      <form>
        <Card>
          <div style={popup ? {display:"flex", justifyContent: "space-between"} : {}}>
          <CardHeader>{t(getCardHeaderAndText("Header")) || t(`PT_RATE_HELP_TEXT`)}</CardHeader>
          {popup && <span style={{marginTop:"8px"}} onClick={() => onClose(false)}>
                  <CloseSvg />
            </span>}
          </div>
          <CardText>{t(getCardHeaderAndText("Text"),{acknowldgementNumber : acknowldgementNumber || data?.Properties?.[0]?.acknowldgementNumber,propertyId : propertyId || data?.Properties?.[0]?.propertyId}) ||t(`PT_RATE_TEXT`)}</CardText>
          <Rating styles={{justifyContent:"center"}} currentRating={rating} maxRating={5} onFeedback={(e, ref, i) => feedback(e, ref, i)} />
          {rating !== 0 && <div>
          <CardLabel>{t(getCommentHeader())}</CardLabel>
          <TextArea 
             name="" 
             minLength = "64"
             onChange={onComments}></TextArea>
             {comment && comment?.length < 64 && <CardLabelError style={{marginTop:"-20px", marginBottom:"25px"}}>{t("CS_MIN_LENGTH_64")}</CardLabelError>}
          </div>}
          <SubmitBar label={t(`${"PT"}_SUBMIT`)} onSubmit={onSubmit} disabled={getCommentCheck()} />
          {!popup && <div className="link" style={isMobile ? { marginTop: "8px", width: "100%", textAlign: "center" } : {marginTop:"8px"}}>
              <Link to={`/digit-ui/citizen`}>{t("CS_GO_BACK_HOME")}</Link>
          </div>}
        </Card>
        </form>
    </React.Fragment>
  );
};

export default CitizenFeedback;
