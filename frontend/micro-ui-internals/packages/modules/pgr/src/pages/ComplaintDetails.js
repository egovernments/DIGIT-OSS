import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LOCALIZATION_KEY } from "../constants/Localization";

import {
  BackButton,
  Card,
  Header,
  CardSubHeader,
  StatusTable,
  TextArea,
  SubmitBar,
  ConnectingCheckPoints,
  CheckPoint,
  DisplayPhotos,
  ImageViewer,
} from "@egovernments/digit-ui-react-components";

import { selectComplaints } from "../selectors/complaint";
import { fetchBusinessServiceById, searchComplaints } from "../redux/actions";
import { selectWorkflow } from "../selectors/processInstance";
// import useComplaintHistory from "../hooks/useComplaintHistory";
import getComplaintHistory from "../hooks/useComplaintHistory";

const ComplaintDetailsPage = (props) => {
  let { t } = useTranslation();
  let { id } = useParams();
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);

  const [complaintHistory, setComplaintHistory] = useState([]);
  const getComplaint = useCallback((id) => dispatch(searchComplaints({ serviceRequestId: id })), [dispatch]);
  const getBusinessServiceById = useCallback((id) => dispatch(fetchBusinessServiceById(id)), [dispatch]);

  useEffect(() => {
    getBusinessServiceById(id);
    getComplaint(id);
  }, [getComplaint, getBusinessServiceById, id]);

  const state = useSelector((state) => state);

  const selectedComplaint = selectComplaints(state);

  const selectedWorkFlow = selectWorkflow(state);

  // const historyData = console.log("historyData:", historyData);

  const [imageZoom, setImageZoom] = useState(null);

  useEffect(() => {
    if (selectedComplaint.length > 0) {
      const historyData = getComplaintHistory(selectedWorkFlow, props.match.path, t, selectedComplaint[0]);
      setComplaintHistory(historyData);
    }
  }, [selectedWorkFlow, props.match.path, t, selectedComplaint]);

  const GetImageIds = (images) => {
    let imageIds = [];
    imageIds = images.map((image) => {
      return image.id;
    });
    return imageIds;
  };

  useEffect(() => {
    async function getImages() {
      if (selectedComplaint.length > 0 && selectedComplaint[0].workflow && selectedComplaint[0].workflow.verificationDocuments) {
        const imageIds = GetImageIds(selectedComplaint[0].workflow.verificationDocuments);
        const files = await Digit.UploadServices.Filefetch(imageIds, state.cityCode);
        setFiles(files);
      }
    }
    getImages();
  }, [selectedComplaint]);

  let complaintDetails = {};

  if (selectedComplaint.length > 0) {
    complaintDetails = selectedComplaint[0];
    Digit.SessionStorage.set(`complaint.${complaintDetails.service.serviceRequestId}`, complaintDetails);
  }
  let cityCode = () => state.cityCode.toUpperCase().replace(".", "_");

  const getFormatedAddress = ({ landmark, buildingName, plotNo, street, locality }) => {
    return (
      <span>
        <p>{landmark}</p> <p>{buildingName}</p>
        <p>
          {plotNo} {street} {t(`revenue.locality.${locality.code}`)}{" "}
        </p>{" "}
        {t(`TENANT_TENANTS_${cityCode()}`)}
      </span>
    );
  };

  const getTableData = () => {
    let { serviceRequestId, applicationStatus, auditDetails, address } = complaintDetails.service;
    let { createdTime } = auditDetails;
    let formattedAddress = getFormatedAddress(address);
    return {
      [t(`${LOCALIZATION_KEY.CS_COMMON}_COMPLAINT_NO`)]: serviceRequestId,
      [t(`${LOCALIZATION_KEY.CS_COMMON}_COMPLAINT_STATUS`)]: t(`${LOCALIZATION_KEY.CS_COMMON}_${applicationStatus}`),
      [t(`${LOCALIZATION_KEY.CS_COMPLAINT_DETAILS}_SUBMISSION_DATE`)]: Digit.DateUtils.ConvertTimestampToDate(createdTime),
      Address: formattedAddress,
    };
  };

  function zoomImage(imageSource) {
    setImageZoom(imageSource);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  return (
    <React.Fragment>
      {/* <BackButton>Back</BackButton> */}
      <Header>{t(`${LOCALIZATION_KEY.CS_HEADER}_COMPLAINT_SUMMARY`)}</Header>

      {Object.keys(complaintDetails).length > 0 && (
        <React.Fragment>
          <Card>
            <CardSubHeader>{t(`SERVICEDEFS.${complaintDetails.service.serviceCode.toUpperCase()}`)}</CardSubHeader>
            <StatusTable dataObject={getTableData()}></StatusTable>
            {files.length > 0 && <DisplayPhotos srcs={[]} onClick={zoomImage} />}
            {imageZoom ? <ImageViewer imageSrc={imageZoom} onClose={onCloseImageZoom} /> : null}
          </Card>
          {
            <React.Fragment>
              <Card>
                <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_COMPLAINT_DETAILS}_COMPLAINT_TIMELINE`)}</CardSubHeader>
                {/* <StatusTable dataObject={getTableData()}></StatusTable> */}
                {complaintHistory && (
                  <ConnectingCheckPoints>
                    {complaintHistory.map((history, index) => {
                      return <CheckPoint key={index} customChild={history.text} isCompleted={true} />;
                    })}
                  </ConnectingCheckPoints>
                )}
              </Card>
            </React.Fragment>
          }
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
