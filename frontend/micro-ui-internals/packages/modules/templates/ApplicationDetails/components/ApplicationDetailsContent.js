import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  BreakLine,
  Card,
  CardSubHeader,
  StatusTable,
  Row,
  Loader,
  CardSectionHeader,
  ConnectingCheckPoints,
  CheckPoint,
  Rating,
  ActionLinks,
} from "@egovernments/digit-ui-react-components";
import TLCaption from "./TLCaption";
import { Link } from "react-router-dom";
import PropertyDocuments from "./PropertyDocuments";
import PropertyFloors from "./PropertyFloors";
import PropertyEstimates from "./PropertyEstimates";

function ApplicationDetailsContent({ applicationDetails, workflowDetails, isDataLoading, applicationData, businessService }) {
  const { t } = useTranslation();

  const getTimelineCaptions = (checkpoint) => {
    if (checkpoint.status === "CREATED") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(applicationData?.auditDetails?.createdTime),
        name: applicationData.citizen.name,
        mobileNumber: applicationData.citizen.mobileNumber,
        source: applicationData.source || "",
      };
      return <TLCaption data={caption} />;
    } else if (
      checkpoint.status === "PENDING_APPL_FEE_PAYMENT"
      // ||
      // checkpoint.status === "ASSING_DSO" ||
      // checkpoint.status === "PENDING_DSO_APPROVAL"
    ) {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(applicationData?.auditDetails.createdTime),
        name: checkpoint.assigner.name,
      };
      return <TLCaption data={caption} />;
    }

    //  else if (checkpoint.status === "DSO_REJECTED") {
    //   const caption = {
    //     date: Digit.DateUtils.ConvertTimestampToDate(applicationData?.auditDetails.createdTime),
    //     name: checkpoint?.assigner?.name,
    //     comment: checkpoint?.comment ? t(`ES_ACTION_REASON_${checkpoint?.comment}`) : null,
    //     otherComment: applicationDetails?.additionalDetails?.comments?.DSO_REJECT,
    //   };
    //   return <TLCaption data={caption} />;
    // } else if (checkpoint.status === "DSO_INPROGRESS") {
    //   const caption = {
    //     name: `${checkpoint?.assigner?.name} (${t("ES_FSM_DSO")})`,
    //     mobileNumber: checkpoint?.assigner?.mobileNumber,
    //     date: `${t("CS_FSM_EXPECTED_DATE")} ${Digit.DateUtils.ConvertTimestampToDate(applicationData?.possibleServiceDate)}`,
    //   };
    //   return <TLCaption data={caption} />;
    // }
    else if (checkpoint.status === "COMPLETED") {
      return (
        <div>
          <Rating withText={true} text={t(`ES_FSM_YOU_RATED`)} currentRating={checkpoint.rating} />
          <Link to={`/digit-ui/employee/fsm/rate-view/${applicationNumber}`}>
            <ActionLinks>{t("CS_FSM_RATE_VIEW")}</ActionLinks>
          </Link>
        </div>
      );
    }
  };

  return (
    <Card style={{ position: "relative" }}>
      {applicationDetails?.applicationDetails?.map((detail, index) => (
        <React.Fragment key={index}>
          {index === 0 ? (
            <CardSubHeader style={{ marginBottom: "16px" }}>{t(detail.title)}</CardSubHeader>
          ) : (
            <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>{t(detail.title)}</CardSectionHeader>
          )}
          <StatusTable>
            {detail?.values?.map((value, index) => {
              if (value.map === true && value.value !== "N/A") {
                return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" />} />;
              }
              return (
                <Row
                  key={t(value.title)}
                  label={t(value.title)}
                  text={t(value.value) || "N/A"}
                  last={index === detail?.values?.length - 1}
                  caption={value.caption}
                  className="border-none"
                />
              );
            })}
          </StatusTable>
          {detail?.additionalDetails?.floors && <PropertyFloors floors={detail?.additionalDetails?.floors} />}
          {detail?.additionalDetails?.documents && <PropertyDocuments documents={detail?.additionalDetails?.documents} />}
          {detail?.additionalDetails?.taxHeadEstimatesCalculation && (
            <PropertyEstimates taxHeadEstimatesCalculation={detail?.additionalDetails?.taxHeadEstimatesCalculation} />
          )}
        </React.Fragment>
      ))}
      <BreakLine />
      {(workflowDetails?.isLoading || isDataLoading) && <Loader />}
      {!workflowDetails?.isLoading && !isDataLoading && (
        <Fragment>
          <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
            {t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
          </CardSectionHeader>
          {workflowDetails?.data?.timeline && workflowDetails?.data?.timeline?.length === 1 ? (
            <CheckPoint
              isCompleted={true}
              label={t(`${businessService === "PT" ? "ES_PT_COMMON_STATUS_" : "CS_COMMON_"}${workflowDetails?.data?.timeline[0]?.state}`)}
              customChild={getTimelineCaptions(workflowDetails?.data?.timeline[0])}
            />
          ) : (
            <ConnectingCheckPoints>
              {workflowDetails?.data?.timeline &&
                workflowDetails?.data?.timeline.map((checkpoint, index, arr) => {
                  return (
                    <React.Fragment key={index}>
                      <CheckPoint
                        keyValue={index}
                        isCompleted={index === 0}
                        label={t(`${businessService === "PT" ? "ES_PT_COMMON_STATUS_" : "CS_COMMON_FSM_"}${checkpoint.state}`)}
                        customChild={getTimelineCaptions(checkpoint)}
                      />
                    </React.Fragment>
                  );
                })}
            </ConnectingCheckPoints>
          )}
        </Fragment>
      )}
    </Card>
  );
}

export default ApplicationDetailsContent;
