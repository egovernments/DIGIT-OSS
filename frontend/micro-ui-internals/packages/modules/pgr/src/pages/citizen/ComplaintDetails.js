import React, { useState } from "react";
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
} from "@egovernments/digit-ui-react-components";

import TimeLine from "../../components/TimeLine";

const WorkflowComponent = ({ complaintDetails, id }) => {
  const tenantId = complaintDetails.service.tenantId;
  const workFlowDetails = Digit.Hooks.useWorkflowDetails({ tenantId: tenantId, id, moduleCode: "PGR" });

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
  const { isLoading, error, isError, complaintDetails } = Digit.Hooks.pgr.useComplaintDetails({ tenantId: cityCodeVal, id });

  const [imageZoom, setImageZoom] = useState(null);

  function zoomImage(imageSource, index) {
    // console.log("index", index, imageSource,complaintDetails.images[index-1],"|||", complaintDetails.images )
    setImageZoom(complaintDetails.images[index - 1]);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  if (isLoading) {
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
              <DisplayPhotos srcs={complaintDetails.thumbnails} onClick={(source, index) => zoomImage(source, index)} />
            ) : null}
            {imageZoom ? <ImageViewer imageSrc={imageZoom} onClose={onCloseImageZoom} /> : null}
          </Card>
          <Card>{complaintDetails?.service && <WorkflowComponent complaintDetails={complaintDetails} id={id} />}</Card>
          <Card>
            <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMMON}_COMMENTS`)}</CardSubHeader>
            <TextArea name={""} />
            <SubmitBar label="Send" />
          </Card>
        </React.Fragment>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default ComplaintDetailsPage;
