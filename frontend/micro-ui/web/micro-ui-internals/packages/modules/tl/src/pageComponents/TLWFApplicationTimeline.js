import { ActionLinks, CardSectionHeader, CheckPoint, ConnectingCheckPoints, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
//TODO : make it a react component
import TLWFCaption from "./TLWFCaption";

const TLWFApplicationTimeline = (props) => {
  const { t } = useTranslation();
  const businessService= props.application?.businessService;
  const { isLoading, data } = Digit.Hooks.useWorkflowDetails({
    tenantId: props.application?.tenantId,
    id: props.id,
    moduleCode: businessService,
  });

  function OpenImage(imageSource, index,thumbnailsToShow){
    window.open(thumbnailsToShow?.fullImage?.[0],"_blank");
  }
  
  const getTimelineCaptions = (checkpoint) => {
    if (checkpoint.state === "INITIATE") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails?.createdTime),
        source: props.application?.tradeLicenseDetail?.channel || "",
      };
      return <TLWFCaption data={caption} />;
    }  
    else {
      // const caption = {
      //   date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails.lastModifiedTime),
      //   name: checkpoint?.assigner?.name,
      //   comment: t(checkpoint?.comment),
      // };

      const caption = {
        date: checkpoint?.auditDetails?.lastModified,
        name: checkpoint?.assignes?.[0]?.name,
        mobileNumber: checkpoint?.assignes?.[0]?.mobileNumber,
        comment: t(checkpoint?.comment),
        wfComment : checkpoint.wfComment,
        thumbnailsToShow : checkpoint?.thumbnailsToShow,
      };
      return <TLWFCaption data={caption} OpenImage={OpenImage}/>;
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
            <CheckPoint
              isCompleted={true}
              label={t((data?.timeline[0]?.state && `WF_${businessService}_${data.timeline[0].state}`) || "NA")}
              customChild={getTimelineCaptions(data?.timeline[0])}
            />
          ) : (
            <ConnectingCheckPoints>
              {data?.timeline &&
                data?.timeline.map((checkpoint, index, arr) => {
                  return (
                    <React.Fragment key={index}>
                      <CheckPoint
                        keyValue={index}
                        isCompleted={index === 0}
                        label={checkpoint.state ? t(`WF_NEW${businessService}_${checkpoint.state}`) : "NA"}
                        customChild={getTimelineCaptions(checkpoint)}
                      />
                    </React.Fragment>
                  );
                })}
            </ConnectingCheckPoints>
          )}
        </Fragment>
      )}
      {/* {data && showNextActions(data?.nextActions)} */}
    </React.Fragment>
  );
};

export default TLWFApplicationTimeline;
