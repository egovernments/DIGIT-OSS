import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Redirect } from "react-router-dom";

import { BackButton, Card, CardHeader, CardText, TextArea, SubmitBar } from "@egovernments/digit-ui-react-components";

import { updateComplaints } from "../../../redux/actions/index";
import { LOCALIZATION_KEY } from "../../../constants/Localization";

const AddtionalDetails = (props) => {
  // const [details, setDetails] = useState(null);
  const history = useHistory();
  let { id } = useParams();
  const dispatch = useDispatch();
  const appState = useSelector((state) => state)["common"];
  let { t } = useTranslation();
  let userType = Digit.SessionStorage.get("userType");
  let tenantId = userType == "CITIZEN" ? Digit.SessionStorage.get("Citizen.tenantId") : Digit.SessionStorage.get("Employee.tenantId");

  const complaintDetails = Digit.Hooks.pgr.useComplaintDetails({ tenantId: tenantId, id: id }).complaintDetails;
  console.log("88888888888888888", tenantId, complaintDetails);
  useEffect(() => {
    if (appState.complaints) {
      const { response } = appState.complaints;
      if (response && response.responseInfo.status === "successful") {
        history.push(`${props.match.path}/response/:${id}`);
      }
    }
  }, [appState.complaints, props.history]);

  const updateComplaint = useCallback((complaintDetails) => dispatch(updateComplaints(complaintDetails)), [dispatch]);

  const getUpdatedWorkflow = (reopenDetails, type) => {
    switch (type) {
      case "REOPEN":
        return {
          action: "REOPEN",
          comments: reopenDetails.addtionalDetail,
          assignes: [],
          verificationDocuments: reopenDetails.verificationDocuments,
        };
      default:
        return "";
    }
  };

  function reopenComplaint() {
    let reopenDetails = Digit.SessionStorage.get(`reopen.${id}`);
    // let complaintDetails = Digit.SessionStorage.get(`complaint.${id}`);
    console.log("reopen complaint1", reopenDetails, complaintDetails);

    // console.log("reopen complaint2", reopenDetails, complaintDetails)

    if (complaintDetails) {
      complaintDetails.workflow = getUpdatedWorkflow(
        reopenDetails,
        // complaintDetails,
        "REOPEN"
      );
      complaintDetails.service.additionalDetail = {
        REOPEN_REASON: reopenDetails.reason,
      };
      updateComplaint({ service: complaintDetails.service, workflow: complaintDetails.workflow });
    }
    return (
      <Redirect
        to={{
          pathname: `${props.parentRoute}/response`,
          state: { complaintDetails },
        }}
      />
    );
  }

  function textInput(e) {
    // setDetails(e.target.value);
    let reopenDetails = Digit.SessionStorage.get(`reopen.${id}`);
    Digit.SessionStorage.set(`reopen.${id}`, {
      ...reopenDetails,
      addtionalDetail: e.target.value,
    });
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PROVIDE_ADDITIONAL_DETAILS`)}</CardHeader>
        <CardText>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_ADDITIONAL_DETAILS_TEXT`)}</CardText>
        <TextArea onChange={textInput}></TextArea>
        <div onClick={reopenComplaint}>
          <SubmitBar label={t(`${LOCALIZATION_KEY.CS_HEADER}_REOPEN_COMPLAINT`)} />
        </div>
      </Card>
    </React.Fragment>
  );
};

export default AddtionalDetails;
