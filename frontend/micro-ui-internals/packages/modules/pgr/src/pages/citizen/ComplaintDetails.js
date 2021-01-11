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

const WorkflowComponent = ({ complaintDetails, id, getWorkFlow }) => {
  const tenantId = complaintDetails.service.tenantId;
  const workFlowDetails = Digit.Hooks.useWorkflowDetails({ tenantId: tenantId, id, moduleCode: "PGR" });

  useEffect(() => {
    getWorkFlow(workFlowDetails.data);
  }, [workFlowDetails.data]);

  return (
    <TimeLine
      isLoading={workFlowDetails.isLoading}
      data={workFlowDetails.data}
      serviceRequestId={id}
      complaintWorkflow={complaintDetails.workflow}
      rating={complaintDetails.audit.rating}
    />
  );
};

const ComplaintDetailsPage = (props) => {
  let { t } = useTranslation();
  let { id } = useParams();

  let cityCodeVal = Digit.ULBService.getCurrentTenantId(); // ToDo: fetch from state
  const { isLoading, error, isError, complaintDetails, revalidate } = Digit.Hooks.pgr.useComplaintDetails({ tenantId: cityCodeVal, id });

  const [imageZoom, setImageZoom] = useState(null);

  const [comment, setComment] = useState("");

  const [toast, setToast] = useState(false);

  const [commentError, setCommentError] = useState(null);

  const [disableComment, setDisableComment] = useState(true);

  const [loader, setLoader] = useState(false);

  useEffect(async () => {
    if (complaintDetails) {
      setLoader(true);
      await revalidate();
      setLoader(false);
    }
  }, []);

  function zoomImage(imageSource) {
    setImageZoom(imageSource);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  const onWorkFlowChange = (data) => {
    let timeline = data?.timeline;
    let status = timeline?.length ? timeline[0].status : null;
    status && (status === "REJECTED" || status === "RESOLVED") ? setDisableComment(false) : setDisableComment(true);
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
                      ? complaintDetails.details[flag].map((val) => t(val))
                      : t(complaintDetails.details[flag])
                  }
                  last={index === arr.length - 1}
                />
              ))}
            </StatusTable>
            {complaintDetails.thumbnails && complaintDetails.thumbnails.length !== 0 ? (
              <DisplayPhotos srcs={complaintDetails.thumbnails} onClick={zoomImage} />
            ) : null}
            {imageZoom ? <ImageViewer imageSrc={imageZoom} onClose={onCloseImageZoom} /> : null}
          </Card>
          <Card>{complaintDetails?.service && <WorkflowComponent getWorkFlow={onWorkFlowChange} complaintDetails={complaintDetails} id={id} />}</Card>
          <Card>
            <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMMON}_COMMENTS`)}</CardSubHeader>
            <TextArea value={comment} onChange={(e) => setComment(e.target.value)} name={""} />
            <SubmitBar disabled={disableComment} onSubmit={submitComment} label="Send" />
          </Card>
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
    </React.Fragment>
  );
};

export default ComplaintDetailsPage;
