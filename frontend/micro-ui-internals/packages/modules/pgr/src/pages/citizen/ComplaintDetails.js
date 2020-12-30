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

const ComplaintDetailsPage = (props) => {
  let { t } = useTranslation();
  let { id } = useParams();

  let cityCodeVal = "pb.amritsar"; // ToDo: fetch from state
  const { isLoading, error, isError, complaintDetails } = Digit.Hooks.pgr.useComplaintDetails({ tenantId: cityCodeVal, id });
  const workFlowDetails = Digit.Hooks.useWorkflowDetails({ tenantId: cityCodeVal, id, moduleCode: "PGR" });

  const [imageZoom, setImageZoom] = useState(null);

  function zoomImage(imageSource) {
    setImageZoom(imageSource);
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
              <DisplayPhotos srcs={complaintDetails.thumbnails} onClick={zoomImage} />
            ) : null}
            {imageZoom ? <ImageViewer imageSrc={imageZoom} onClose={onCloseImageZoom} /> : null}
          </Card>
          <Card>
            <TimeLine
              isLoading={workFlowDetails.isLoading}
              data={workFlowDetails.data}
              serviceRequestId={id}
              complaintWorkflow={complaintDetails.workflow}
              rating={complaintDetails.audit.rating}
            />
          </Card>
          <Card>
            <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMMON}_COMMENTS`)}</CardSubHeader>
            <TextArea />
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
