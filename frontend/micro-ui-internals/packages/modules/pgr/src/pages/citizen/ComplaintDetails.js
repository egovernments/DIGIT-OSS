import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LOCALIZATION_KEY } from "../../constants/Localization";

import {
  BackButton,
  Card,
  Header,
  CardSubHeader,
  StatusTable,
  Row,
  LastRow,
  TextArea,
  SubmitBar,
  ConnectingCheckPoints,
  CheckPoint,
  DisplayPhotos,
  ImageViewer,
} from "@egovernments/digit-ui-react-components";

import { selectComplaints } from "../../selectors/complaint";
import { fetchBusinessServiceById, searchComplaints } from "../../redux/actions";
import useComplaintDetails from "../../hooks/useComplaintDetails";
import TimeLine from "./CreateComplaint/TimeLine";
import useWorkflowDetails from "../../hooks/useWorkflowDetails";

const ComplaintDetailsPage = (props) => {
  let { t } = useTranslation();
  let { id } = useParams();
  const dispatch = useDispatch();
  const getComplaint = useCallback((id) => dispatch(searchComplaints({ serviceRequestId: id })), [dispatch]);
  const getBusinessServiceById = useCallback((id) => dispatch(fetchBusinessServiceById(id)), [dispatch]);

  useEffect(() => {
    getBusinessServiceById(id);
    getComplaint(id);
  }, [getComplaint, getBusinessServiceById, id]);

  const state = useSelector((state) => state);
  let cityCodeVal = "pb.amritsar"; // ToDo: fetch from state
  const statusTableData = useComplaintDetails({ tenantId: cityCodeVal, id });
  const statusTableFlags = [
    "CS_COMPLAINT_DETAILS_COMPLAINT_NO",
    "CS_COMPLAINT_DETAILS_APPLICATION_STATUS",
    "CS_COMPLAINT_FILED_DATE",
    "CS_COMPLAINT_DETAILS_LANDMARK",
    "CS_COMPLAINT_DETAILS_DOOR",
    "CS_COMPLAINT_DETAILS_BUILDING_NAME",
    "CS_COMPLAINT_DETAILS_PLOT_NO",
    "CS_COMPLAINT_DETAILS_STREET",
    "CS_COMPLAINT_DETAILS_LOCALITY",
    "CS_COMPLAINT_DETAILS_CITY",
  ];
  const timeLineData = useWorkflowDetails({ tenantId: cityCodeVal, id });
  const selectedComplaint = selectComplaints(state);

  const [imageZoom, setImageZoom] = useState(null);

  let complaintDetails = {};

  if (selectedComplaint.length > 0) {
    complaintDetails = selectedComplaint[0];
    Digit.SessionStorage.set(`complaint.${complaintDetails.service.serviceRequestId}`, complaintDetails);
  }

  function zoomImage(imageSource) {
    setImageZoom(imageSource);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  return (
    <React.Fragment>
      <Header>{t(`${LOCALIZATION_KEY.CS_HEADER}_COMPLAINT_SUMMARY`)}</Header>

      {Object.keys(complaintDetails).length > 0 && (
        <React.Fragment>
          <Card>
            <CardSubHeader>{t(`SERVICEDEFS.${complaintDetails.service.serviceCode.toUpperCase()}`)}</CardSubHeader>
            <StatusTable>
              {statusTableFlags.map((flag, index, arr) =>
                arr.length - 1 === index ? (
                  <LastRow key={index} label={t(flag)} text={t(statusTableData[flag])} />
                ) : (
                  <Row key={index} label={t(flag)} text={t(statusTableData[flag])} />
                )
              )}
            </StatusTable>
            {statusTableData.thumbnails && statusTableData.thumbnails.length !== 0 ? (
              <DisplayPhotos srcs={statusTableData.thumbnails} onClick={zoomImage} />
            ) : null}
            {imageZoom ? <ImageViewer imageSrc={imageZoom} onClose={onCloseImageZoom} /> : null}
          </Card>
          <Card>
            <TimeLine
              data={timeLineData}
              serviceRequestId={selectedComplaint[0].service.serviceRequestId}
              complaintWorkflow={selectedComplaint[0].workflow}
              rating={selectedComplaint[0].service.rating}
            />
          </Card>
          <Card>
            <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMMON}_COMMENTS`)}</CardSubHeader>
            <TextArea />
            <SubmitBar label="Send" />
          </Card>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ComplaintDetailsPage;
