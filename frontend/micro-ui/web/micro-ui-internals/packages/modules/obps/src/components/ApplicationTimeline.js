import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ActionLinks, CardSectionHeader, CheckPoint, ConnectingCheckPoints, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";

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

  const showNextActions = (nextAction) => {
    switch (nextAction?.action) {
      case "PAY":
        return (
          <div style={{ marginTop: "24px" }}>
            <Link
              to={{}}
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
              // customChild={getTimelineCaptions(data?.timeline[0])}
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
                        label={checkpoint.state ? t(`WF_ARCHITECT_${checkpoint.state}`) : "NA"}
                        // customChild={getTimelineCaptions(checkpoint)}
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