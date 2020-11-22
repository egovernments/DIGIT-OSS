import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
} from "@egovernments/digit-ui-react-components";

import { selectComplaints } from "../../selectors/complaint";
import { fetchBusinessServiceById, searchComplaints } from "../../redux/actions";
import { selectWorkflow } from "../../selectors/processInstance";
import useComplaintHistory from "../../hooks/useComplaintHistory";

const ComplaintDetailsPage = () => {
  const LOCALIZATION_KEY_CS_COMPLAINT = "CS_COMPLAINT_DETAILS";
  const LOCALIZATION_KEY_CS_COMMON = "CS_COMMON";

  let { t } = useTranslation();
  let { id } = useParams();
  const dispatch = useDispatch();

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
  const historyData = useComplaintHistory(selectedWorkFlow);

  useEffect(() => {
    if (historyData) {
      Promise.all(historyData)
        .then((values) => {
          setComplaintHistory(values);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [historyData]);

  let complaintDetails = {};

  if (selectedComplaint.length > 0) {
    complaintDetails = selectedComplaint[0];
    Digit.SessionStorage.set(`complaint.${complaintDetails.service.serviceRequestId}`, complaintDetails);
  }
  let cityCode = () => state.cityCode.toUpperCase().replace(".", "_");

  const getFormatedAddress = ({ landmark, buildingName, plotNo, street, locality }) => {
    return `${landmark}, ${buildingName}, ${plotNo ? "Plot no-" + plotNo : ""}, ${street}, ${t(locality.code)}, ${t(`TENANT_TENANTS_${cityCode()}`)}`;
  };

  const getTableData = () => {
    let { serviceRequestId, applicationStatus, auditDetails, address } = complaintDetails.service;

    let { createdTime } = auditDetails;

    let formattedAddress = getFormatedAddress(address);
    return {
      [t(`${LOCALIZATION_KEY_CS_COMMON}_COMPLAINT_NO`)]: serviceRequestId,
      [t(`${LOCALIZATION_KEY_CS_COMMON}_COMPLAINT_STATUS`)]: t(`${LOCALIZATION_KEY_CS_COMMON}_${applicationStatus}`),
      [t(`${LOCALIZATION_KEY_CS_COMPLAINT}_SUBMISSION_DATE`)]: Digit.DateUtils.ConvertTimestampToDate(createdTime),
      Address: formattedAddress,
    };
  };

  return (
    <React.Fragment>
      {/* <BackButton>Back</BackButton> */}
      <Header>{t("CS_HEADER_COMPLAINT_SUMMARY")}</Header>

      {Object.keys(complaintDetails).length > 0 && (
        <React.Fragment>
          <Card>
            <CardSubHeader>{t(`SERVICEDEFS.${complaintDetails.service.serviceCode.toUpperCase()}`)}</CardSubHeader>
            <StatusTable dataObject={getTableData()}></StatusTable>
          </Card>
          {
            <React.Fragment>
              <Card>
                <CardSubHeader>{t(`${LOCALIZATION_KEY_CS_COMPLAINT}_COMPLAINT_TIMELINE`)}</CardSubHeader>
                {/* <StatusTable dataObject={getTableData()}></StatusTable> */}
                <ConnectingCheckPoints>
                  {complaintHistory.map((history, index) => {
                    return (
                      <React.Fragment key={index}>
                        <CheckPoint label={t(`${LOCALIZATION_KEY_CS_COMMON}_${history.applicationStatus}`)} info={history.text} isCompleted={true} />
                      </React.Fragment>
                    );
                  })}
                </ConnectingCheckPoints>
              </Card>
            </React.Fragment>
          }
          <Card>
            <CardSubHeader>{t(`${LOCALIZATION_KEY_CS_COMMON}_COMMENTS`)}</CardSubHeader>
            <TextArea />
            <SubmitBar label="Send" />
          </Card>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ComplaintDetailsPage;
