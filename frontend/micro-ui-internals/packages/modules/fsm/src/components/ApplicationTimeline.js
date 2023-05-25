import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  Header,
  ActionLinks,
  Card,
  CardSectionHeader,
  ConnectingCheckPoints,
  CheckPoint,
  KeyNote,
  SubmitBar,
  LinkButton,
  Loader,
  Rating,
} from "@egovernments/digit-ui-react-components";
import TLCaption from "./TLCaption";

export const ApplicationTimeline = (props) => {
  const { t } = useTranslation();
  const { isLoading, data } = Digit.Hooks.useWorkflowDetails({
    tenantId: props.application?.tenantId,
    id: props.id,
    moduleCode: "FSM",
  });

  const getTimelineCaptions = (checkpoint) => {
    const __comment = checkpoint?.comment?.split("~");
    const reason = __comment ? __comment[0] : null;
    const reason_comment = __comment ? __comment[1] : null;
    if (checkpoint.status === "CREATED") {
      const caption = {
        date: checkpoint?.auditDetails?.created,
        source: props.application?.source || "",
      };
      return <TLCaption data={caption} />;
    } else if (
      checkpoint.status === "PENDING_APPL_FEE_PAYMENT" ||
      checkpoint.status === "ASSING_DSO" ||
      checkpoint.status === "PENDING_DSO_APPROVAL" ||
      checkpoint.status === "DSO_REJECTED" ||
      checkpoint.status === "CANCELED" ||
      checkpoint.status === "REJECTED"
    ) {
      const caption = {
        date: checkpoint?.auditDetails?.created,
        name: checkpoint?.assigner,
        comment: reason ? t(`ES_ACTION_REASON_${reason}`) : null,
        otherComment: reason_comment ? reason_comment : null,
      };
      return <TLCaption data={caption} />;
    } else if (checkpoint.status === "CITIZEN_FEEDBACK_PENDING") {
      return (
        <>
          {data?.nextActions.length > 0 && (
            <div>
              <Link to={`/digit-ui/citizen/fsm/rate/${props.id}`}>
                <ActionLinks>{t("CS_FSM_RATE")}</ActionLinks>
              </Link>
            </div>
          )}
        </>
      );
    } else if (checkpoint.status === "DSO_INPROGRESS") {
      const caption = {
        name: checkpoint?.assigner,
        mobileNumber: props.application?.dsoDetails?.mobileNumber,
        date: `${t("CS_FSM_EXPECTED_DATE")} ${Digit.DateUtils.ConvertTimestampToDate(props.application?.possibleServiceDate)}`,
      };
      return <TLCaption data={caption} />;
    } else if (checkpoint.status === "COMPLETED") {
      return (
        <div>
          <Rating withText={true} text={t(`CS_FSM_YOU_RATED`)} currentRating={checkpoint.rating} />
          <Link to={`/digit-ui/citizen/fsm/rate-view/${props.id}`}>
            <ActionLinks>{t("CS_FSM_RATE_VIEW")}</ActionLinks>
          </Link>
        </div>
      );
    }
  };

  const showNextActions = (nextAction) => {
    switch (nextAction?.action) {
      case "PAY":
        return (
          <div style={{ marginTop: "24px" }}>
            <Link
              to={{
                pathname: `/digit-ui/citizen/payment/collect/FSM.TRIP_CHARGES/${props.id}/?tenantId=${props.application.tenantId}`,
                state: { tenantId: props.application.tenantId },
              }}
            >
              <SubmitBar label={t("CS_APPLICATION_DETAILS_MAKE_PAYMENT")} />
            </Link>
          </div>
        );
      case "SUBMIT_FEEDBACK":
        return (
          <div style={{ marginTop: "24px" }}>
            <Link to={`/digit-ui/citizen/fsm/rate/${props.id}`}>
              <SubmitBar label={t("CS_APPLICATION_DETAILS_RATE")} />
            </Link>
          </div>
        );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {!isLoading && (
        <Fragment>
          {data?.timeline?.length > 0 && (
            <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
              {t("CS_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
            </CardSectionHeader>
          )}
          {data?.timeline && data?.timeline?.length === 1 ? (
            <CheckPoint isCompleted={true} label={t("CS_COMMON_" + data?.timeline[0]?.status)} customChild={getTimelineCaptions(data?.timeline[0])} />
          ) : (
            <ConnectingCheckPoints>
              {data?.timeline &&
                data?.timeline.map((checkpoint, index, arr) => {
                  return (
                    <React.Fragment key={index}>
                      <CheckPoint
                        keyValue={index}
                        isCompleted={index === 0}
                        label={t("CS_COMMON_" + checkpoint.status)}
                        customChild={getTimelineCaptions(checkpoint)}
                      />
                    </React.Fragment>
                  );
                })}
            </ConnectingCheckPoints>
          )}
        </Fragment>
      )}
      {data && showNextActions(data?.nextActions[0])}
    </React.Fragment>
  );
};
