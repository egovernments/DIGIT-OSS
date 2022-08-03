import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LOCALIZATION_KEY } from "../../constants/Localization";

import {
  Card,
  Header,
  CardSubHeader,
  StatusTable,
  Row,
  TextArea,
  SubmitBar,
  DisplayPhotos,
  ImageViewer,
  Loader,
  Toast,
} from "@egovernments/digit-ui-react-components";

import TimeLine from "../../components/TimeLine";

const WorkflowComponent = ({ complaintDetails, id, getWorkFlow, zoomImage }) => {
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || complaintDetails.service.tenantId;
  let workFlowDetails = Digit.Hooks.useWorkflowDetails({ tenantId: tenantId, id, moduleCode: "PGR" });
  const { data: ComplainMaxIdleTime, isLoading: ComplainMaxIdleTimeLoading } = Digit.Hooks.pgr.useMDMS.ComplainClosingTime(tenantId?.split(".")[0]);

  useEffect(() => {
    getWorkFlow(workFlowDetails.data);
  }, [workFlowDetails.data]);

  useEffect(() => {
    workFlowDetails.revalidate();
  }, []);

  return (
    !workFlowDetails.isLoading && (
      <TimeLine
        // isLoading={workFlowDetails.isLoading}
        data={workFlowDetails.data}
        serviceRequestId={id}
        complaintWorkflow={complaintDetails.workflow}
        rating={complaintDetails.audit.rating}
        zoomImage={zoomImage}
        complaintDetails={complaintDetails}
        ComplainMaxIdleTime={ComplainMaxIdleTime}
      />
    )
  );
};

const ComplaintDetailsPage = (props) => {
  let { t } = useTranslation();
  let { id } = useParams();

  let tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId(); // ToDo: fetch from state
  const { isLoading, error, isError, complaintDetails, revalidate } = Digit.Hooks.pgr.useComplaintDetails({ tenantId, id });

  const [imageShownBelowComplaintDetails, setImageToShowBelowComplaintDetails] = useState({});

  const [imageZoom, setImageZoom] = useState(null);

  const [comment, setComment] = useState("");

  const [toast, setToast] = useState(false);

  const [commentError, setCommentError] = useState(null);

  const [disableComment, setDisableComment] = useState(true);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    (async () => {
      if (complaintDetails) {
        setLoader(true);
        await revalidate();
        setLoader(false);
      }
    })();
  }, []);

  function zoomImage(imageSource, index) {
    setImageZoom(imageSource);
  }
  function zoomImageWrapper(imageSource, index) {
    zoomImage(imageShownBelowComplaintDetails?.fullImage[index]);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  const onWorkFlowChange = (data) => {
    let timeline = data?.timeline;
    timeline && timeline[0].timeLineActions?.filter((e) => e === "COMMENT").length ? setDisableComment(false) : setDisableComment(true);
    if (timeline) {
      const actionByCitizenOnComplaintCreation = timeline.find((e) => e?.performedAction === "APPLY");
      const { thumbnailsToShow } = actionByCitizenOnComplaintCreation;
      setImageToShowBelowComplaintDetails(thumbnailsToShow);
    }
  };

  const submitComment = async () => {
    let detailsToSend = { ...complaintDetails };
    delete detailsToSend.audit;
    delete detailsToSend.details;
    detailsToSend.workflow = { action: "COMMENT", comments: comment };
    let tenantId = Digit.ULBService.getCurrentTenantId();
    try {
      setCommentError(null);
      const res = await Digit.PGRService.update(detailsToSend, tenantId);
      if (res.ServiceWrappers.length) setComment("");
      else throw true;
    } catch (er) {
      setCommentError(true);
    }
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, 30000);
  };

  if (isLoading || loader) {
    return <Loader />;
  }

  if (isError) {
    return <h2>Error</h2>;
  }

  return (
    <React.Fragment>
      <div className="complaint-summary">
        <Header>{t(`${LOCALIZATION_KEY.CS_HEADER}_COMPLAINT_SUMMARY`)}</Header>

        {Object.keys(complaintDetails).length > 0 ? (
          <React.Fragment>
            <Card>
              <CardSubHeader>{t(`SERVICEDEFS.${complaintDetails.audit.serviceCode.toUpperCase()}`)}</CardSubHeader>
              <StatusTable>
                {Object.keys(complaintDetails.details).map((flag, index, arr) => (
                  <Row
                    key={index}
                    label={t(flag)}
                    text={
                      Array.isArray(complaintDetails.details[flag])
                        ? complaintDetails.details[flag].map((val) => (typeof val === "object" ? t(val?.code) : t(val)))
                        : t(complaintDetails.details[flag]) || "N/A"
                    }
                    last={index === arr.length - 1}
                  />
                ))}
              </StatusTable>
              {imageShownBelowComplaintDetails?.thumbs ? (
                <DisplayPhotos srcs={imageShownBelowComplaintDetails?.thumbs} onClick={(source, index) => zoomImageWrapper(source, index)} />
              ) : null}
              {imageZoom ? <ImageViewer imageSrc={imageZoom} onClose={onCloseImageZoom} /> : null}
            </Card>
            <Card>
              {complaintDetails?.service && (
                <WorkflowComponent getWorkFlow={onWorkFlowChange} complaintDetails={complaintDetails} id={id} zoomImage={zoomImage} />
              )}
            </Card>
            {/* <Card>
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMMON}_COMMENTS`)}</CardSubHeader>
      <TextArea value={comment} onChange={(e) => setComment(e.target.value)} name="" />
      <SubmitBar disabled={disableComment || comment.length < 1} onSubmit={submitComment} label={t("CS_PGR_SEND_COMMENT")} />
    </Card> */}
            {toast && (
              <Toast
                error={commentError}
                label={!commentError ? t(`CS_COMPLAINT_COMMENT_SUCCESS`) : t(`CS_COMPLAINT_COMMENT_ERROR`)}
                onClose={() => setToast(false)}
              />
            )}{" "}
          </React.Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </React.Fragment>
  );
};

export default ComplaintDetailsPage;