import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ActionLinks, CardSectionHeader, CheckPoint, ConnectingCheckPoints, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import BPACaption from "../pages/citizen/BpaApplicationDetail/BPACaption";

const ApplicationTimeline = ({ id, tenantId }) => {
  const { t } = useTranslation();
  const { isLoading, data } = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: "OBPS",
  });
  if (isLoading) {
    return <Loader />;
  }

  function OpenImage(imageSource, index,thumbnailsToShow){
    window.open(thumbnailsToShow?.fullImage?.[0],"_blank");
  }

  const getTimelineCaptions = (checkpoint) => {
    // if (checkpoint.state === "INITIATE") {
    //   const caption = {
    //     date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails?.createdTime),
    //     source: props.application?.tradeLicenseDetail?.channel || "",
    //   };
    //   return <BPACaption data={caption} />;
    // }  
    // else {
      const caption = {
        // date: checkpoint?.auditDetails?.lastModified,
        // name: checkpoint?.assignes?.[0]?.name,
        // mobileNumber: checkpoint?.assignes?.[0]?.mobileNumber,
        // comment: t(checkpoint?.comment),
        date: checkpoint?.auditDetails?.lastModified,
        name: checkpoint?.assignes?.[0]?.name,
        mobileNumber: checkpoint?.assignes?.[0]?.mobileNumber,
        comment: t(checkpoint?.comment),
        wfComment : checkpoint.wfComment,
        thumbnailsToShow : checkpoint?.thumbnailsToShow,
      };
    //}
  return <BPACaption data={caption} OpenImage={OpenImage} />;
  };

  const showNextActions = (nextAction) => {
    switch (nextAction?.action) {
      case "PAY":
        return (
          <div style={{ marginTop: "24px" }} className="action-bar-wrap">
            <Link
              to={{ pathname: `/digit-ui/citizen/payment/collect/${data?.processInstances?.[0]?.moduleName}/${data?.processInstances?.[0]?.businessId}`,
              state: { tenantId: data?.processInstances?.[0]?.tenantId },}}
            >
              <SubmitBar label={t("TL_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT")} />
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
            <CheckPoint
              isCompleted={true}
              label={t((data?.timeline[0]?.state && `WF_ARCHITECT_${data.timeline[0].state}`) || "NA")}
              customChild={getTimelineCaptions(data?.timeline[0])}
            />
          ) : (
            <ConnectingCheckPoints>
              {data?.timeline &&
                data?.timeline.map((checkpoint, index, arr) => {
                  let timelineStatusPostfix = "";
                  if (window.location.href.includes("/obps")) {
                    if(data?.timeline[index-1]?.state?.includes("BACK_FROM") || data?.timeline[index-1]?.state?.includes("SEND_TO_CITIZEN"))
                        timelineStatusPostfix = `_NOT_DONE`
                    else if(checkpoint?.performedAction === "SEND_TO_ARCHITECT")
                        timelineStatusPostfix = `_BY_ARCHITECT_DONE`
                    else
                        timelineStatusPostfix = index == 0 ? "" : `_DONE`;
                  }
                  return (
                    <React.Fragment key={index}>
                      <CheckPoint
                        keyValue={index}
                        isCompleted={index === 0}
                        label={checkpoint.state ? t(`WF_ARCHITECT_${checkpoint.state}${timelineStatusPostfix}`) : "NA"}
                        customChild={getTimelineCaptions(checkpoint)}
                      />
                    </React.Fragment>
                  );
                })}
            </ConnectingCheckPoints>
          )}
        </Fragment>
      )}
      {data && showNextActions(data?.nextActions?.[0])}
    </React.Fragment>
  );
};

export default ApplicationTimeline;